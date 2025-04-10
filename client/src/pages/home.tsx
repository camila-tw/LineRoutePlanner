import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddressForm } from "@/components/AddressForm";
import { CSVUpload } from "@/components/CSVUpload";
import { GoogleSheetInput } from "@/components/GoogleSheetInput";
import { RouteResult } from "@/components/RouteResult";
import { useAddressInput } from "@/hooks/useAddressInput";

export default function Home() {
  const [activeTab, setActiveTab] = useState("manual");
  
  const {
    route,
    isLoading,
    error,
    handleManualAddressSubmit,
    handleCsvUpload,
    handleGoogleSheetSubmit,
  } = useAddressInput();
  
  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">地址輸入與路徑規劃</h2>
          
          <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="manual">手動輸入</TabsTrigger>
              <TabsTrigger value="csv">CSV 上傳</TabsTrigger>
              <TabsTrigger value="sheet">Google Sheet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <AddressForm 
                onSubmit={handleManualAddressSubmit}
                isLoading={isLoading} 
              />
            </TabsContent>
            
            <TabsContent value="csv">
              <CSVUpload 
                onUpload={handleCsvUpload}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="sheet">
              <GoogleSheetInput 
                onSubmit={handleGoogleSheetSubmit}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">路徑規劃結果</h2>
          
          <RouteResult
            route={route}
            isLoading={isLoading}
            error={error || undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}
