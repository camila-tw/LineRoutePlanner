import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, Route as RouteIcon } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CSVUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export function CSVUpload({ onUpload, isLoading }: CSVUploadProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    
    // Read the file and attempt to parse it for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rows = content.split('\n');
        
        // Check if there's any content
        if (rows.length <= 1) {
          setError("CSV檔案似乎是空的或格式不正確");
          setPreviewData(null);
          return;
        }
        
        // Get headers
        const headers = rows[0].split(',').map(h => h.trim());
        
        // Check for address column
        if (!headers.some(h => h.toLowerCase().includes('address') || h.toLowerCase().includes('地址'))) {
          setError("CSV檔案必須包含地址欄位（address或地址）");
          setPreviewData(null);
          return;
        }
        
        // Parse a few rows for preview
        const preview = [];
        const maxPreviewRows = Math.min(rows.length - 1, 5);
        
        for (let i = 1; i <= maxPreviewRows; i++) {
          if (rows[i].trim()) {
            const cells = rows[i].split(',').map(c => c.trim());
            const rowData: Record<string, string> = {};
            
            headers.forEach((header, index) => {
              rowData[header] = cells[index] || '';
            });
            
            preview.push(rowData);
          }
        }
        
        if (preview.length === 0) {
          setError("無法解析CSV資料，請確認格式是否正確");
          setPreviewData(null);
          return;
        }
        
        setPreviewData(preview);
      } catch (err) {
        console.error("CSV parsing error:", err);
        setError("解析CSV檔案時發生錯誤");
        setPreviewData(null);
      }
    };
    
    reader.onerror = () => {
      setError("讀取CSV檔案時發生錯誤");
      setPreviewData(null);
    };
    
    reader.readAsText(selectedFile);
  };
  
  const handleSubmit = () => {
    if (!file) {
      toast({
        title: "錯誤",
        description: "請先選擇CSV檔案",
        variant: "destructive",
      });
      return;
    }
    
    onUpload(file);
  };
  
  return (
    <div className="space-y-4">
      <Alert className="bg-yellow-50 border-yellow-100">
        <Info className="h-4 w-4 text-yellow-800" />
        <AlertTitle className="text-yellow-800 flex items-center">
          CSV 檔案格式說明
        </AlertTitle>
        <AlertDescription className="text-yellow-700 text-sm mt-1">
          請上傳包含地址的 CSV 檔案，檔案應包含以下欄位：地址（必填）、備註（選填）。
          第一列應為標題列，起點應為第一個地址，終點為最後一個地址。
        </AlertDescription>
      </Alert>
      
      <FileUpload 
        onFileSelect={handleFileSelect}
        error={error || undefined}
      />
      
      {previewData && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">檔案預覽</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">序號</TableHead>
                  {Object.keys(previewData[0]).map((header) => (
                    <TableHead 
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {rowIndex === 0 ? '1 (起點)' : rowIndex === previewData.length - 1 ? `${rowIndex + 1} (終點)` : rowIndex + 1}
                    </TableCell>
                    {Object.values(row).map((cell, cellIndex) => (
                      <TableCell 
                        key={cellIndex}
                        className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                      >
                        {cell as string}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
