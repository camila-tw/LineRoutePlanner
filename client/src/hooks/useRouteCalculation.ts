import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useRouteCalculation(routeId?: number) {
  const { toast } = useToast();
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  
  // Fetch route details if routeId is provided
  const { 
    data: route,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: routeId ? [`/api/routes/${routeId}`] : null,
    enabled: !!routeId,
  });
  
  const sendLineNotification = async (routeId: number, recipientId: string, message?: string) => {
    if (!routeId) return;
    
    setIsSendingNotification(true);
    
    try {
      await apiRequest("POST", "/api/send-line-notification", {
        routeId,
        recipientId,
        message,
      });
      
      toast({
        title: "LINE通知已發送",
        description: "路線連結已成功發送至指定的LINE接收者",
      });
      
      // Refetch route to update notification status
      if (refetch) {
        refetch();
      }
      
      return true;
    } catch (err) {
      console.error("發送LINE通知失敗:", err);
      
      toast({
        title: "發送LINE通知失敗",
        description: "無法發送通知，請確認LINE設定是否正確",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSendingNotification(false);
    }
  };
  
  return {
    route,
    isLoading,
    error,
    isSendingNotification,
    sendLineNotification,
  };
}
