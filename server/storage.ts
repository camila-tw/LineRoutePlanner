import { 
  users, type User, type InsertUser, 
  addresses, type Address, type InsertAddress,
  routes, type Route, type InsertRoute,
  lineSettings, type LineSettings, type InsertLineSettings
} from "@shared/schema";

// Modify the interface with necessary CRUD methods
export interface IStorage {
  // User operations (from the template)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Address operations
  createAddress(address: InsertAddress): Promise<Address>;
  getAddressesByRouteId(routeId: number): Promise<Address[]>;
  updateAddressCoordinates(id: number, lat: string, lng: string): Promise<Address | undefined>;
  
  // Route operations
  createRoute(route: InsertRoute): Promise<Route>;
  getRoute(id: number): Promise<Route | undefined>;
  getAllRoutes(): Promise<Route[]>;
  updateRoute(id: number, route: Partial<InsertRoute>): Promise<Route | undefined>;
  updateRouteNotificationStatus(id: number, sent: boolean): Promise<Route | undefined>;
  
  // LINE settings operations
  createLineSettings(settings: InsertLineSettings): Promise<LineSettings>;
  getAllLineSettings(): Promise<LineSettings[]>;
  getActiveLineSettings(): Promise<LineSettings[]>;
  getLineSettingsById(id: number): Promise<LineSettings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private addresses: Map<number, Address>;
  private routes: Map<number, Route>;
  private lineSettings: Map<number, LineSettings>;
  
  private userCurrentId: number;
  private addressCurrentId: number;
  private routeCurrentId: number;
  private lineSettingsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.addresses = new Map();
    this.routes = new Map();
    this.lineSettings = new Map();
    
    this.userCurrentId = 1;
    this.addressCurrentId = 1;
    this.routeCurrentId = 1;
    this.lineSettingsCurrentId = 1;
    
    // Add some default LINE settings
    this.createLineSettings({
      recipientName: "運輸部門群組",
      recipientId: "transport_group_1",
      isActive: true,
    });
    
    this.createLineSettings({
      recipientName: "配送人員",
      recipientId: "delivery_staff",
      isActive: true,
    });
    
    this.createLineSettings({
      recipientName: "主管",
      recipientId: "managers",
      isActive: true,
    });
  }

  // User operations (from the template)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Address operations
  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const id = this.addressCurrentId++;
    const address: Address = { ...insertAddress, id };
    this.addresses.set(id, address);
    return address;
  }
  
  async getAddressesByRouteId(routeId: number): Promise<Address[]> {
    return Array.from(this.addresses.values())
      .filter(address => address.routeId === routeId)
      .sort((a, b) => {
        if (a.isStartPoint) return -1;
        if (b.isStartPoint) return 1;
        if (a.isEndPoint) return 1;
        if (b.isEndPoint) return -1;
        return (a.sequence || 0) - (b.sequence || 0);
      });
  }
  
  async updateAddressCoordinates(id: number, lat: string, lng: string): Promise<Address | undefined> {
    const address = this.addresses.get(id);
    if (!address) return undefined;
    
    const updatedAddress: Address = { ...address, lat, lng };
    this.addresses.set(id, updatedAddress);
    return updatedAddress;
  }
  
  // Route operations
  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = this.routeCurrentId++;
    const createdAt = new Date();
    const route: Route = { ...insertRoute, id, createdAt };
    this.routes.set(id, route);
    return route;
  }
  
  async getRoute(id: number): Promise<Route | undefined> {
    return this.routes.get(id);
  }
  
  async getAllRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async updateRoute(id: number, routeUpdate: Partial<InsertRoute>): Promise<Route | undefined> {
    const route = this.routes.get(id);
    if (!route) return undefined;
    
    const updatedRoute: Route = { ...route, ...routeUpdate };
    this.routes.set(id, updatedRoute);
    return updatedRoute;
  }
  
  async updateRouteNotificationStatus(id: number, sent: boolean): Promise<Route | undefined> {
    const route = this.routes.get(id);
    if (!route) return undefined;
    
    const updatedRoute: Route = { ...route, lineNotificationSent: sent };
    this.routes.set(id, updatedRoute);
    return updatedRoute;
  }
  
  // LINE settings operations
  async createLineSettings(insertSettings: InsertLineSettings): Promise<LineSettings> {
    const id = this.lineSettingsCurrentId++;
    const settings: LineSettings = { ...insertSettings, id };
    this.lineSettings.set(id, settings);
    return settings;
  }
  
  async getAllLineSettings(): Promise<LineSettings[]> {
    return Array.from(this.lineSettings.values());
  }
  
  async getActiveLineSettings(): Promise<LineSettings[]> {
    return Array.from(this.lineSettings.values())
      .filter(setting => setting.isActive);
  }
  
  async getLineSettingsById(id: number): Promise<LineSettings | undefined> {
    return this.lineSettings.get(id);
  }
}

export const storage = new MemStorage();
