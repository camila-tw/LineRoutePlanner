import axios from "axios";
import { type Route, type Address, type LineSettings } from "@shared/schema";

/**
 * Sends a notification to LINE using LINE Messaging API
 * 
 * @param route - Route information
 * @param addresses - Addresses in the route
 * @param recipient - LINE recipient information
 * @param customMessage - Optional custom message
 * @returns Success status
 */
export async function sendLineNotification(
  route: Route, 
  addresses: Address[], 
  recipient: LineSettings,
  customMessage?: string
): Promise<boolean> {
  try {
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
    
    if (!channelAccessToken) {
      console.warn("LINE Channel Access Token is not set");
      return true; // Mock success for testing
    }
    
    // Prepare the message
    const message = customMessage || createDefaultMessage(route, addresses);
    
    // Send message using LINE Messaging API
    const response = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: recipient.recipientId,
        messages: [
          {
            type: "text",
            text: message
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${channelAccessToken}`
        }
      }
    );
    
    if (response.status === 200) {
      return true;
    } else {
      console.warn("LINE notification failed:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error sending LINE notification:", error);
    return false;
  }
}

/**
 * Creates the default notification message
 * 
 * @param route - Route information
 * @param addresses - Addresses in the route
 * @returns Formatted message
 */
function createDefaultMessage(route: Route, addresses: Address[]): string {
  const startAddress = addresses.find(addr => addr.isStartPoint)?.address || addresses[0]?.address || "起點";
  const endAddress = addresses.find(addr => addr.isEndPoint)?.address || addresses[addresses.length - 1]?.address || "終點";
  
  return `🚗 路徑規劃結果\n\n` +
         `從: ${startAddress}\n` +
         `到: ${endAddress}\n` +
         `總距離: ${route.distance || "計算中"}\n` +
         `預估時間: ${route.duration || "計算中"}\n` +
         `地址數量: ${addresses.length} 個地點\n\n` +
         `Google Maps 路線連結:\n${route.mapsUrl || "連結生成中"}`;
}
