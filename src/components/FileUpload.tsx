import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Here we would handle the file upload to a backend service
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg">
      <Upload className="h-10 w-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold">Upload Breach Data</h3>
      <p className="text-sm text-muted-foreground">
        Drag and drop your file here or click to browse
      </p>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        accept=".txt,.csv,.json"
      />
      <Button
        disabled={isUploading}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        {isUploading ? "Uploading..." : "Select File"}
      </Button>
    </div>
  );
}