import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type AddressInput, type GoogleSheetInput } from "@shared/schema";

export function useAddressInput() {
  const { toast } = useToast();
  const [route, setRoute] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleManualAddressSubmit = async (data: AddressInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/plan-route", data);
      const routeData = await response.json();
      
      setRoute(routeData);
      toast({
        title: "路徑規劃完成",
        description: "已成功生成路徑規劃結果",
      });
    } catch (err) {
      console.error("路徑規劃失敗:", err);
      setError("處理地址時發生錯誤，請確認地址是否正確");
      toast({
        title: "路徑規劃失敗",
        description: "無法完成路徑規劃，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCsvUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "上傳CSV失敗");
      }
      
      const routeData = await response.json();
      setRoute(routeData);
      
      toast({
        title: "CSV處理完成",
        description: "已成功處理CSV檔案並生成路徑規劃結果",
      });
    } catch (err) {
      console.error("CSV處理失敗:", err);
      setError(err instanceof Error ? err.message : "處理CSV檔案時發生錯誤");
      toast({
        title: "CSV處理失敗",
        description: err instanceof Error ? err.message : "無法處理CSV檔案，請確認格式是否正確",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSheetSubmit = async (data: GoogleSheetInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("POST", "/api/import-sheet", data);
      const responseData = await response.json();
      
      if (responseData.message && !responseData.addresses) {
        throw new Error(responseData.message);
      }
      
      setRoute(responseData);
      toast({
        title: "Google Sheet處理完成",
        description: "已成功處理Google Sheet資料並生成路徑規劃結果",
      });
    } catch (err) {
      console.error("Google Sheet處理失敗:", err);
      setError(err instanceof Error ? err.message : "處理Google Sheet時發生錯誤");
      toast({
        title: "Google Sheet處理失敗",
        description: err instanceof Error ? err.message : "無法處理Google Sheet資料，請確認權限設定",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    route,
    isLoading,
    error,
    handleManualAddressSubmit,
    handleCsvUpload,
    handleGoogleSheetSubmit,
  };
}
