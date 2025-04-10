import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LineSettings {
  id: number;
  recipientName: string;
  recipientId: string;
  isActive: boolean;
}

interface Route {
  id: number;
  name: string;
  distance: string;
  duration: string;
  mapsUrl: string;
}

interface LineNotificationProps {
  route: Route;
  onSendNotification: (recipientId: string, message?: string) => void;
  isSending: boolean;
  alreadySent: boolean;
}

const formSchema = z.object({
  enabled: z.boolean().default(true),
  recipientId: z.string().min(1, "請選擇接收通知的LINE使用者/群組"),
  customMessage: z.string().optional(),
});

export function LineNotification({ 
  route, 
  onSendNotification, 
  isSending,
  alreadySent
}: LineNotificationProps) {
  const [previewMessage, setPreviewMessage] = useState("");
  
  // Fetch LINE settings
  const { data: lineSettings, isLoading } = useQuery({
    queryKey: ["/api/line-settings"],
    select: (data: LineSettings[]) => data.filter(setting => setting.isActive),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: true,
      recipientId: "",
      customMessage: "",
    },
  });
  
  // Generate default message for preview
  useEffect(() => {
    const defaultMessage = 
      `🚗 路徑規劃結果\n\n` +
      `總距離: ${route.distance || "計算中"}\n` +
      `預估時間: ${route.duration || "計算中"}\n` +
      `地址數量: ${route.addresses?.length || 0} 個地點\n\n` +
      `Google Maps 路線連結:\n${route.mapsUrl || "連結生成中"}`;
    
    setPreviewMessage(form.watch("customMessage") || defaultMessage);
  }, [route, form.watch("customMessage")]);
  
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (!data.enabled) return;
    
    onSendNotification(
      data.recipientId,
      data.customMessage
    );
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE Logo" className="w-6 h-6 mr-2" />
        LINE 通知
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="enableLineNotification"
                      />
                    </FormControl>
                    <FormLabel htmlFor="enableLineNotification" className="text-sm font-medium text-gray-700">
                      啟用 LINE 通知
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="recipientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">接收通知的 LINE 使用者/群組</FormLabel>
                    <Select
                      disabled={!form.watch("enabled") || isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇接收者" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoading ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">載入中...</span>
                          </div>
                        ) : (
                          lineSettings?.map(setting => (
                            <SelectItem 
                              key={setting.id}
                              value={setting.id.toString()}
                            >
                              {setting.recipientName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">自訂訊息 (選填)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="輸入自訂訊息，若為空則使用預設訊息"
                        className="resize-none"
                        rows={3}
                        disabled={!form.watch("enabled")}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-1">通知預覽</h4>
              <div className="p-2 bg-white rounded border border-gray-200">
                <pre className="text-sm whitespace-pre-wrap">{previewMessage}</pre>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              type="submit"
              className="w-full flex justify-center items-center"
              disabled={!form.watch("enabled") || isSending || form.formState.isSubmitting || alreadySent}
              variant={alreadySent ? "outline" : "default"}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE Logo" className="w-5 h-5 mr-2" />
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  發送中...
                </>
              ) : alreadySent ? (
                "已發送 LINE 通知"
              ) : (
                "立即發送 LINE 通知"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
