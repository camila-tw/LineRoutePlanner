import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Home, Flag } from "lucide-react";
import { LineNotification } from "@/components/LineNotification";
import { apiRequest } from "@/lib/queryClient";

interface Address {
  id: number;
  address: string;
  lat: string;
  lng: string;
  note: string;
  isStartPoint: boolean;
  isEndPoint: boolean;
  routeId: number;
  sequence: number;
}

interface Route {
  id: number;
  name: string;
  distance: string;
  duration: string;
  mapsUrl: string;
  createdAt: Date;
  lineNotificationSent: boolean;
  addresses: Address[];
}

interface RouteResultProps {
  route?: Route;
  isLoading: boolean;
  error?: string;
}

export function RouteResult({ route, isLoading, error }: RouteResultProps) {
  const { toast } = useToast();
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  
  const handleSendNotification = async (recipientId: string, message?: string) => {
    if (!route) return;
    
    setIsSendingNotification(true);
    try {
      await apiRequest("POST", "/api/send-line-notification", {
        routeId: route.id,
        recipientId,
        message
      });
      
      toast({
        title: "通知已發送",
        description: "LINE通知已成功發送",
      });
    } catch (error) {
      console.error("發送LINE通知失敗:", error);
      toast({
        title: "發送失敗",
        description: "無法發送LINE通知，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };
  
  // Processing State
  if (isLoading) {
    return (
      <div id="processingState" className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h3 className="text-lg font-medium text-gray-700">正在處理中</h3>
        <p className="text-gray-500 mt-1">正在進行地址轉換與路徑計算...</p>
      </div>
    );
  }
  
  // Error State
  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons text-red-500">error</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">處理時發生錯誤</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Empty State
  if (!route) {
    return (
      <div id="emptyState" className="py-8 text-center">
        <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-700">尚未產生路徑規劃</h3>
        <p className="mt-2 text-gray-500">請先輸入地址資訊並點擊「產生路徑規劃」按鈕</p>
      </div>
    );
  }
  
  // Result Content
  return (
    <div id="resultContent">
      {/* Summary Info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">總距離</p>
            <p className="text-2xl font-semibold text-gray-800">{route.distance || "計算中"}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">預估時間</p>
            <p className="text-2xl font-semibold text-gray-800">{route.duration || "計算中"}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">地址數量</p>
            <p className="text-2xl font-semibold text-gray-800">{route.addresses?.length || 0} 個地點</p>
          </div>
        </div>
      </div>
      
      {/* Map Preview */}
      <div className="mb-6">
        <div className="relative h-64 bg-gray-200 rounded-lg" id="mapPreview">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">
              {route.mapsUrl ? "地圖預覽載入中..." : "無法載入地圖預覽"}
            </p>
          </div>
          {route.mapsUrl && (
            <div className="absolute bottom-4 right-4">
              <a 
                href={route.mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white px-3 py-2 rounded-md shadow text-sm text-gray-700 hover:bg-gray-50"
              >
                <ExternalLink className="mr-1 h-4 w-4" />
                在 Google Maps 開啟
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Route Details */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">路線詳情</h3>
        <div className="space-y-3">
          {route.addresses.map((point, index) => (
            <div key={point.id} className="flex">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white
                  ${point.isStartPoint ? 'bg-blue-500' : (point.isEndPoint ? 'bg-green-500' : 'bg-gray-500')}`}
                >
                  {point.isStartPoint ? (
                    <Home className="h-4 w-4" />
                  ) : point.isEndPoint ? (
                    <Flag className="h-4 w-4" />
                  ) : (
                    index
                  )}
                </div>
                {index < route.addresses.length - 1 && (
                  <div className="absolute w-0.5 h-16 bg-gray-300 mt-8"></div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-800">{point.address}</p>
                  <p className="text-sm text-gray-500">
                    {point.isStartPoint ? '起點' : point.isEndPoint ? '終點' : '途經點'} 
                    {point.note && ` - ${point.note}`}
                  </p>
                  <div className="text-xs text-gray-400 mt-1">
                    經緯度: {point.lat}, {point.lng}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* LINE Notification */}
      <LineNotification 
        route={route} 
        onSendNotification={handleSendNotification}
        isSending={isSendingNotification}
        alreadySent={route.lineNotificationSent}
      />
    </div>
  );
}
