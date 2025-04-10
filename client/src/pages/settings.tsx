import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API 設定</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>API 金鑰資訊</AlertTitle>
            <AlertDescription>
              本應用程式需要以下 API 金鑰才能正常運作：
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>Google Maps API Key</strong> - 用於地址轉換與路徑規劃
                  <div className="text-sm text-muted-foreground mt-1">
                    設定方式：將 API Key 設為環境變數 <code>GOOGLE_MAPS_API_KEY</code>
                  </div>
                </li>
                <li>
                  <strong>LINE Messaging API Channel Access Token</strong> - 用於發送 LINE 通知
                  <div className="text-sm text-muted-foreground mt-1">
                    設定方式：將 Channel Access Token 設為環境變數 <code>LINE_CHANNEL_ACCESS_TOKEN</code>
                  </div>
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>LINE Messaging API 設定指南</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">建立 LINE Bot</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>前往 <a href="https://developers.line.biz/console/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LINE Developers Console</a></li>
                <li>登入您的 LINE 帳號</li>
                <li>建立新的 Provider（若尚未有）</li>
                <li>在 Provider 下建立新的 Channel，選擇「Messaging API」類型</li>
                <li>填寫必要資訊（Channel 名稱、描述、類別等）</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">取得 Channel Access Token</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>在 Channel 設定頁面中，前往「Messaging API」標籤</li>
                <li>在「Channel access token」區塊，點擊「Issue」按鈕</li>
                <li>複製生成的 Token，並設定為環境變數 <code>LINE_CHANNEL_ACCESS_TOKEN</code></li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">設定 Webhook URL</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>在「Webhook settings」區塊，啟用 Webhook</li>
                <li>設定 Webhook URL 為 <code>https://您的網站網址/api/line-webhook</code></li>
                <li>點擊「Verify」確認 Webhook 設定正確</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">添加好友</h3>
              <p>用戶必須將您的 LINE Bot 添加為好友，才能接收通知：</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>在 Channel 設定頁面找到 QR Code</li>
                <li>用 LINE App 掃描此 QR Code 添加為好友</li>
                <li>或分享 Basic ID (@xxxx) 給需要接收通知的用戶</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Google Maps API 設定指南</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">建立 Google Cloud 專案</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>前往 <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                <li>建立新專案或選擇現有專案</li>
                <li>啟用結帳功能（需要信用卡，但有免費額度）</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">啟用所需 API</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>前往「API 和服務」 {'->'} 「程式庫」</li>
                <li>搜尋並啟用以下 API：
                  <ul className="list-disc pl-5 mt-2">
                    <li>Geocoding API - 用於地址轉換為經緯度</li>
                    <li>Directions API - 用於計算路線</li>
                    <li>Maps JavaScript API - 用於顯示地圖</li>
                  </ul>
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">建立 API 金鑰</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>前往「API 和服務」 {'->'} 「憑證」</li>
                <li>點擊「建立憑證」 {'->'} 「API 金鑰」</li>
                <li>建議設定 API 金鑰限制（限制 HTTP 參考來源與 API 使用範圍）</li>
                <li>複製生成的 API 金鑰，並設定為環境變數 <code>GOOGLE_MAPS_API_KEY</code></li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2">管理配額與計費</h3>
              <p>Google Maps API 提供每月免費額度，但超出額度會產生費用：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>設定預算警報以避免意外收費</li>
                <li>監控 API 使用情況</li>
                <li>考慮實施用量限制以控制成本</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
