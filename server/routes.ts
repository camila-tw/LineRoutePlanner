import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { 
  addressInputSchema, 
  csvUploadSchema,
  googleSheetInputSchema,
  lineNotificationSchema
} from "@shared/schema";
import { geocodeAddresses } from "./services/geocode";
import { optimizeRoute, generateMapsUrl } from "./services/routeOptimization";
import { sendLineNotification } from "./services/lineBot";
import { parse } from "csv-parse/sync";
import { csvUpload } from "./services/fileProcessor";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up multer for file uploads (CSV files)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "text/csv" || file.originalname.endsWith('.csv')) {
        cb(null, true);
      } else {
        cb(new Error("只接受 CSV 檔案"));
      }
    }
  });

  // Get all routes (history)
  app.get("/api/routes", async (req: Request, res: Response) => {
    try {
      const routes = await storage.getAllRoutes();
      
      // Get addresses for each route to include in response
      const routesWithAddresses = await Promise.all(
        routes.map(async (route) => {
          const addresses = await storage.getAddressesByRouteId(route.id);
          return {
            ...route,
            addresses
          };
        })
      );
      
      res.json(routesWithAddresses);
    } catch (error) {
      console.error("獲取路線失敗", error);
      res.status(500).json({ message: "獲取路線失敗" });
    }
  });
  
  // Get single route
  app.get("/api/routes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "無效的路線ID" });
      }
      
      const route = await storage.getRoute(id);
      if (!route) {
        return res.status(404).json({ message: "找不到路線" });
      }
      
      const addresses = await storage.getAddressesByRouteId(id);
      res.json({
        ...route,
        addresses
      });
    } catch (error) {
      console.error("獲取路線失敗", error);
      res.status(500).json({ message: "獲取路線失敗" });
    }
  });

  // Manual address input route planning
  app.post("/api/plan-route", async (req: Request, res: Response) => {
    try {
      // Validate input
      const validatedData = addressInputSchema.parse(req.body);
      
      // Create a new route
      const route = await storage.createRoute({
        name: `路線 ${new Date().toLocaleString("zh-TW")}`,
        distance: "",
        duration: "",
        mapsUrl: "",
        lineNotificationSent: false
      });
      
      // Process addresses
      const allAddresses = [
        { ...validatedData.startPoint, isStartPoint: true, isEndPoint: false, sequence: 0 },
        ...validatedData.waypoints.map((wp, idx) => ({ 
          ...wp, 
          isStartPoint: false, 
          isEndPoint: false,
          sequence: idx + 1
        })),
        { ...validatedData.endPoint, isStartPoint: false, isEndPoint: true, sequence: validatedData.waypoints.length + 1 }
      ];
      
      // Store addresses
      const addressPromises = allAddresses.map(addr => 
        storage.createAddress({
          address: addr.address,
          note: addr.note || "",
          isStartPoint: addr.isStartPoint || false,
          isEndPoint: addr.isEndPoint || false,
          routeId: route.id,
          sequence: addr.sequence,
          lat: null,
          lng: null
        })
      );
      
      const createdAddresses = await Promise.all(addressPromises);
      
      // Convert addresses to coordinates using Google Maps Geocoding API
      const geocodedAddresses = await geocodeAddresses(createdAddresses);
      
      // Update addresses with coordinates
      const updatePromises = geocodedAddresses.map(addr => 
        storage.updateAddressCoordinates(addr.id, addr.lat, addr.lng)
      );
      
      await Promise.all(updatePromises);
      
      // Get all addresses for this route with coordinates
      const addresses = await storage.getAddressesByRouteId(route.id);
      
      // Calculate optimal route using Google Routes API
      const optimizedRoute = await optimizeRoute(addresses);
      
      // Generate Google Maps URL
      const mapsUrl = generateMapsUrl(addresses);
      
      // Update route with results
      const updatedRoute = await storage.updateRoute(route.id, {
        distance: optimizedRoute.distance,
        duration: optimizedRoute.duration,
        mapsUrl
      });
      
      res.json({
        ...updatedRoute,
        addresses
      });
    } catch (error) {
      console.error("路徑規劃失敗", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "輸入資料格式不正確", errors: error.errors });
      }
      res.status(500).json({ message: "路徑規劃失敗" });
    }
  });
  
  // CSV upload route planning
  app.post("/api/upload-csv", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "請上傳CSV檔案" });
      }
      
      // Parse CSV file
      const csvContent = req.file.buffer.toString("utf8");
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
      
      if (records.length === 0) {
        return res.status(400).json({ message: "CSV檔案不包含任何地址" });
      }
      
      // Process CSV data
      const addresses = csvUpload(records);
      
      // Create a new route
      const route = await storage.createRoute({
        name: `CSV匯入 ${new Date().toLocaleString("zh-TW")}`,
        distance: "",
        duration: "",
        mapsUrl: "",
        lineNotificationSent: false
      });
      
      // Store addresses
      const addressPromises = addresses.map((addr, index) => 
        storage.createAddress({
          address: addr.address,
          note: addr.note || "",
          isStartPoint: index === 0,
          isEndPoint: index === addresses.length - 1,
          routeId: route.id,
          sequence: index,
          lat: null,
          lng: null
        })
      );
      
      const createdAddresses = await Promise.all(addressPromises);
      
      // Convert addresses to coordinates using Google Maps Geocoding API
      const geocodedAddresses = await geocodeAddresses(createdAddresses);
      
      // Update addresses with coordinates
      const updatePromises = geocodedAddresses.map(addr => 
        storage.updateAddressCoordinates(addr.id, addr.lat, addr.lng)
      );
      
      await Promise.all(updatePromises);
      
      // Get all addresses for this route with coordinates
      const routeAddresses = await storage.getAddressesByRouteId(route.id);
      
      // Calculate optimal route using Google Routes API
      const optimizedRoute = await optimizeRoute(routeAddresses);
      
      // Generate Google Maps URL
      const mapsUrl = generateMapsUrl(routeAddresses);
      
      // Update route with results
      const updatedRoute = await storage.updateRoute(route.id, {
        distance: optimizedRoute.distance,
        duration: optimizedRoute.duration,
        mapsUrl
      });
      
      res.json({
        ...updatedRoute,
        addresses: routeAddresses
      });
    } catch (error) {
      console.error("CSV處理失敗", error);
      res.status(500).json({ message: "CSV處理失敗" });
    }
  });
  
  // Google Sheet import route planning
  app.post("/api/import-sheet", async (req: Request, res: Response) => {
    try {
      // Validate input
      const validatedData = googleSheetInputSchema.parse(req.body);
      
      // Here we would have actual Google Sheets API integration
      // For simplicity, we're using mock data since the API key setup would be required
      res.status(501).json({ message: "Google Sheet API功能尚未實現，請使用CSV上傳或手動輸入" });
    } catch (error) {
      console.error("Google Sheet匯入失敗", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "輸入的Google Sheet連結無效", errors: error.errors });
      }
      res.status(500).json({ message: "Google Sheet匯入失敗" });
    }
  });
  
  // Send LINE notification
  app.post("/api/send-line-notification", async (req: Request, res: Response) => {
    try {
      // Validate input
      const validatedData = lineNotificationSchema.parse(req.body);
      
      // Get route and recipient information
      const route = await storage.getRoute(validatedData.routeId);
      if (!route) {
        return res.status(404).json({ message: "找不到路線" });
      }
      
      const recipient = await storage.getLineSettingsById(parseInt(validatedData.recipientId));
      if (!recipient) {
        return res.status(404).json({ message: "找不到LINE接收者" });
      }
      
      // Get addresses for this route
      const addresses = await storage.getAddressesByRouteId(route.id);
      
      // Send LINE notification
      const notificationResult = await sendLineNotification(route, addresses, recipient, validatedData.message);
      
      // Update route notification status
      await storage.updateRouteNotificationStatus(route.id, true);
      
      res.json({ success: true, message: "LINE通知已發送" });
    } catch (error) {
      console.error("LINE通知發送失敗", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "輸入資料格式不正確", errors: error.errors });
      }
      res.status(500).json({ message: "LINE通知發送失敗" });
    }
  });
  
  // Get LINE notification settings
  app.get("/api/line-settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getAllLineSettings();
      res.json(settings);
    } catch (error) {
      console.error("獲取LINE設定失敗", error);
      res.status(500).json({ message: "獲取LINE設定失敗" });
    }
  });
  
  // LINE Webhook endpoint
  app.post("/api/line-webhook", async (req: Request, res: Response) => {
    try {
      console.log("LINE Webhook 接收到事件:", JSON.stringify(req.body));
      // 在正式環境中，我們需要驗證簽名
      // 並處理 LINE 事件（如 好友加入、訊息等）
      
      // 必須回傳 200 OK 給 LINE 平台
      res.status(200).end();
    } catch (error) {
      console.error("LINE Webhook 處理失敗:", error);
      res.status(500).end();
    }
  });
  
  // Simple GET endpoint for webhook verification
  app.get("/api/line-webhook", (req: Request, res: Response) => {
    res.status(200).json({ status: "LINE Webhook endpoint is working" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
