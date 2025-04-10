import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { googleSheetInputSchema, type GoogleSheetInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Route as RouteIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoogleSheetInputProps {
  onSubmit: (data: GoogleSheetInput) => void;
  isLoading: boolean;
}

export function GoogleSheetInput({ onSubmit, isLoading }: GoogleSheetInputProps) {
  const { toast } = useToast();
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  
  const form = useForm<GoogleSheetInput>({
    resolver: zodResolver(googleSheetInputSchema),
    defaultValues: {
      url: "",
    },
  });
  
  const handleLoadSheet = (data: GoogleSheetInput) => {
    // In a real application, we would fetch data from the Google Sheet API here
    // For now, we'll simulate loading data
    toast({
      title: "Google Sheet連結已接收",
      description: "正在嘗試處理...",
    });
    
    // Mock loading the sheet data
    setTimeout(() => {
      // For demo purposes, show some sample data
      setPreviewData([
        { address: "台北市中正區忠孝東路一段1號", note: "總部" },
        { address: "台北市信義區松仁路58號", note: "分店A" },
        { address: "台北市大安區復興南路一段390號", note: "倉庫" },
      ]);
    }, 500);
  };
  
  const handleSubmit = () => {
    if (previewData) {
      onSubmit(form.getValues());
    } else {
      toast({
        title: "錯誤",
        description: "請先載入Google Sheet資料",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <Alert className="bg-yellow-50 border-yellow-100">
        <Info className="h-4 w-4 text-yellow-800" />
        <AlertTitle className="text-yellow-800 flex items-center">
          Google Sheet 格式說明
        </AlertTitle>
        <AlertDescription className="text-yellow-700 text-sm mt-1">
          請輸入已共享的 Google Sheet 連結，表格應包含以下欄位：地址（必填）、備註（選填）。
          第一列應為標題列，起點應為第一個地址，終點為最後一個地址。
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLoadSheet)} className="space-y-3">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Sheet 連結</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input 
                      placeholder="https://docs.google.com/spreadsheets/d/..." 
                      {...field} 
                      className="flex-1 rounded-r-none"
                    />
                  </FormControl>
                  <Button 
                    type="submit" 
                    className="rounded-l-none"
                    disabled={isLoading}
                  >
                    載入
                  </Button>
                </div>
                <p className="text-sm text-gray-500">確保 Google Sheet 已設為「任何人都可以查看」</p>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      
      {previewData && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">資料預覽</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">序號</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地址</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備註</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {index === 0 ? '1 (起點)' : index === previewData.length - 1 ? `${index + 1} (終點)` : index + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{row.address}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Button
            type="button"
            className="mt-4 w-full flex justify-center items-center"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <RouteIcon className="mr-1 h-5 w-5" />
            {isLoading ? "處理中..." : "產生路徑規劃"}
          </Button>
        </div>
      )}
    </div>
  );
}
