import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HelpCircle, FileText, Upload, Table, Route as RouteIcon, MessageSquare } from "lucide-react";

export default function Help() {
  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            說明與支援
          </CardTitle>
          <CardDescription>
            關於多點路徑規劃及 LINE Bot 通知工具的使用指南
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            本工具可協助您快速規劃多個地點間的最佳路徑，並透過 LINE 發送通知給指定的使用者或群組。
            以下是各功能的詳細說明和使用指南。
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  手動輸入地址
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-gray-600">
                <p>手動輸入地址是最基本的使用方式，適合地址數量較少的情況：</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>在「起點地址」欄位中輸入您的出發地點</li>
                  <li>點擊「新增地址」按鈕來增加中途地點</li>
                  <li>在「終點地址」欄位中輸入您的最終目的地</li>
                  <li>點擊「產生路徑規劃」按鈕</li>
                </ol>
                <p className="mt-2">系統會自動將地址轉換為經緯度，並計算出最佳路線。</p>
                <Alert className="mt-2">
                  <AlertDescription>
                    請確保地址格式正確，盡量包含城市名稱以提高地址轉換的準確性。
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  CSV 檔案上傳
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-gray-600">
                <p>CSV 上傳功能適合批次處理大量地址：</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>準備 CSV 檔案，包含「地址」欄位（必要）及「備註」欄位（選填）</li>
                  <li>第一列應為標題列（如「地址,備註」）</li>
                  <li>第一筆地址會被視為起點，最後一筆地址會被視為終點</li>
                  <li>上傳 CSV 檔案後，系統會顯示預覽</li>
                  <li>確認資料無誤後，點擊「產生路徑規劃」按鈕</li>
                </ol>
                <p className="mt-2">CSV 範例格式：</p>
                <pre className="bg-gray-100 p-2 rounded-md text-sm">
                  {`地址,備註
台北市中正區忠孝東路一段1號,總部
台北市信義區松仁路58號,分店A
台北市大安區復興南路一段390號,倉庫`}
                </pre>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center">
                  <Table className="h-5 w-5 mr-2" />
                  Google Sheet 整合
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-gray-600">
                <p>Google Sheet 整合功能讓您可以直接從線上試算表匯入地址：</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>在 Google Sheet 中準備好地址資料，確保表格包含「地址」欄位</li>
                  <li>將試算表設為「任何人都可以查看」的共享權限</li>
                  <li>複製 Google Sheet 的連結</li>
                  <li>在系統中貼上連結並點擊「載入」</li>
                  <li>確認預覽資料正確後，點擊「產生路徑規劃」</li>
                </ol>
                <Alert className="mt-2">
                  <AlertDescription>
                    請確保您的 Google Sheet 已正確設定共享權限，否則系統將無法讀取資料。
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center">
                  <RouteIcon className="h-5 w-5 mr-2" />
                  路徑規劃結果
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-gray-600">
                <p>成功產生路徑規劃後，系統會顯示以下資訊：</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>路線摘要：總距離、預估時間、地址數量</li>
                  <li>Google Maps 預覽與連結：可直接在 Google Maps 中檢視完整路線</li>
                  <li>路線詳情：起點、中途點、終點及各點經緯度資訊</li>
                  <li>LINE 通知選項：可將路線連結發送給指定的 LINE 接收者</li>
                </ul>
                <p className="mt-2">您可以透過「在 Google Maps 開啟」按鈕，在新視窗中檢視詳細路線。</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  LINE 通知功能
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-gray-600">
                <p>您可以透過 LINE 通知功能，將路徑規劃結果發送給指定的使用者或群組：</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>在路徑規劃結果頁面中，找到「LINE 通知」區塊</li>
                  <li>確認「啟用 LINE 通知」已勾選</li>
                  <li>從下拉選單中選擇接收通知的 LINE 使用者/群組</li>
                  <li>可選擇性地輸入自訂訊息</li>
                  <li>點擊「立即發送 LINE 通知」按鈕</li>
                </ol>
                <p className="mt-2">系統會自動生成包含路線摘要和 Google Maps 連結的訊息，發送給指定的接收者。</p>
                <Alert className="mt-2">
                  <AlertDescription>
                    請確保系統已正確設定 LINE Bot 的相關資訊，且接收者已將 LINE Bot 加為好友，否則可能無法收到通知。
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  常見問題
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-gray-600">
                <div>
                  <h4 className="font-medium">為什麼某些地址無法轉換為經緯度？</h4>
                  <p>可能原因：</p>
                  <ul className="list-disc pl-6">
                    <li>地址格式不正確或不完整</li>
                    <li>地址不存在或Google Maps資料庫中沒有該地址資訊</li>
                    <li>API金鑰問題或達到使用上限</li>
                  </ul>
                  <p>建議使用完整地址，包含城市和區域名稱。</p>
                </div>

                <div>
                  <h4 className="font-medium">如何編輯已建立的路線？</h4>
                  <p>目前系統不支援直接編輯已建立的路線，您需要重新輸入地址資訊並產生新的路線。</p>
                </div>

                <div>
                  <h4 className="font-medium">為什麼無法發送LINE通知？</h4>
                  <p>可能原因：</p>
                  <ul className="list-disc pl-6">
                    <li>LINE Bot設定問題，如Channel Access Token無效</li>
                    <li>接收者未將LINE Bot加為好友</li>
                    <li>網路連線問題</li>
                  </ul>
                  <p>請檢查系統設定頁面中的LINE API設定是否正確。</p>
                </div>

                <div>
                  <h4 className="font-medium">系統支援哪些路線計算模式？</h4>
                  <p>系統使用Google Routes API進行路線計算，預設以行車模式計算最佳路線。目前不支援切換至步行、大眾運輸等其他模式。</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>聯絡支援</CardTitle>
          <CardDescription>
            如有問題或需要協助，請通過以下方式聯繫我們
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              若您在使用過程中遇到任何問題，或有功能改進建議，請透過以下管道與我們聯繫：
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  電子郵件
                </h3>
                <p className="text-gray-600">support@routeplanner.example.com</p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  技術支援專線
                </h3>
                <p className="text-gray-600">(02) 1234-5678</p>
                <p className="text-sm text-gray-500">週一至週五 9:00-18:00</p>
              </div>
            </div>
            
            <Alert>
              <AlertDescription>
                建議您在聯繫支援時提供詳細的問題描述和截圖，這有助於我們更快速地為您解決問題。
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
