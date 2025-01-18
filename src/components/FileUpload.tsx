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
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process file');
      }

      const result = await response.json();
      toast.success(`Successfully processed ${result.count} entries`);
      
      // Trigger a refresh of the data table
      window.location.reload();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to process file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg">
      <Upload className="h-10 w-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold">Upload Breach Data</h3>
      <p className="text-sm text-muted-foreground">
        Upload a text file containing URLs to parse
      </p>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        accept=".txt"
      />
      <Button
        disabled={isUploading}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        {isUploading ? "Processing..." : "Select File"}
      </Button>
    </div>
  );
}