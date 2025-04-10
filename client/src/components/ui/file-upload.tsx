import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onFileSelect: (file: File) => void;
  className?: string;
  buttonText?: string;
  description?: string;
  error?: string;
}

export function FileUpload({
  accept = ".csv",
  maxSize = 5 * 1024 * 1024, // 5MB
  onFileSelect,
  className,
  buttonText = "選擇檔案",
  description = "支援的檔案格式：.csv",
  error,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };
  
  const validateAndProcessFile = (file: File) => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert("只接受 CSV 檔案");
      return;
    }
    
    // Check file size
    if (file.size > maxSize) {
      alert(`檔案大小不能超過 ${maxSize / (1024 * 1024)}MB`);
      return;
    }
    
    setFileName(file.name);
    onFileSelect(file);
  };
  
  const handleButtonClick = () => {
    inputRef.current?.click();
  };
  
  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-gray-300",
        error ? "border-destructive" : "",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-2">
        <Upload className="mx-auto h-10 w-10 text-gray-400" />
        <h4 className="text-lg font-medium text-gray-700">
          {fileName ? `已選擇：${fileName}` : "拖放 CSV 檔案或點擊上傳"}
        </h4>
        <p className="text-sm text-gray-500">{description}</p>
        <input 
          type="file" 
          ref={inputRef}
          accept={accept}
          onChange={handleFileChange}
          className="hidden" 
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleButtonClick}
        >
          {buttonText}
        </Button>
        
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
