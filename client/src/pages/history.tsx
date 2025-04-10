import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { formatDistance } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Link } from "wouter";

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
  createdAt: string;
  lineNotificationSent: boolean;
  addresses: Address[];
}

export default function History() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const { data: routes, isLoading, error } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };
  
  const sortedRoutes = routes
    ? [...routes].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      })
    : [];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">載入歷史記錄中...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <h3 className="text-sm font-medium text-red-800">載入失敗</h3>
            <p className="text-sm text-red-700 mt-1">無法載入歷史記錄，請稍後再試</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!routes || routes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center h-48">
          <h3 className="text-lg font-medium text-gray-700">尚無歷史記錄</h3>
          <p className="text-gray-500 mt-1">產生路徑規劃後會顯示在此處</p>
          <Link href="/">
            <Button className="mt-4">建立新的路徑規劃</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>歷史記錄</CardTitle>
            <Button variant="outline" size="sm" onClick={toggleSortOrder}>
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === "desc" ? "由新到舊" : "由舊到新"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedRoutes.map((route) => {
              const startAddress = route.addresses.find(a => a.isStartPoint)?.address || route.addresses[0]?.address;
              const endAddress = route.addresses.find(a => a.isEndPoint)?.address || route.addresses[route.addresses.length - 1]?.address;
              const createdAt = new Date(route.createdAt);
              
              return (
                <div key={route.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{route.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        建立時間: {createdAt.toLocaleString("zh-TW")} ({formatDistance(createdAt, new Date(), { addSuffix: true, locale: zhTW })})
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {route.mapsUrl && (
                        <a 
                          href={route.mapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded border text-sm hover:bg-gray-100"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">總距離</p>
                      <p className="font-medium">{route.distance}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">預估時間</p>
                      <p className="font-medium">{route.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">地址數量</p>
                      <p className="font-medium">{route.addresses.length} 個地點</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <p><span className="text-gray-500">從：</span> {startAddress}</p>
                    <p><span className="text-gray-500">到：</span> {endAddress}</p>
                  </div>
                  
                  <div className="mt-3 flex items-center">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        route.lineNotificationSent 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {route.lineNotificationSent ? 'LINE通知已發送' : 'LINE通知未發送'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
