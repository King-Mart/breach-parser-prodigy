import { useState } from "react";
import { Upload, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { uploadFile } from "@/api/database";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File is too large. Maximum size is 10MB");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Simulate progress while processing
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const result = await uploadFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast.success(`Successfully processed ${result.count} entries`);
      
      // Trigger a refresh of the data table
      window.location.reload();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to process file");
    } finally {
      setIsUploading(false);
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg">
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          File upload functionality is currently under development. Check back soon!
        </AlertDescription>
      </Alert>
      {isUploading ? (
        <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
      ) : (
        <Upload className="h-10 w-10 text-muted-foreground" />
      )}
      <h3 className="text-lg font-semibold">Upload Breach Data</h3>
      <p className="text-sm text-muted-foreground">
        Upload a text file containing URLs to parse (max 10MB)
      </p>
      {progress > 0 && (
        <div className="w-full max-w-xs space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            {progress === 100 ? 'Processing complete!' : 'Processing file...'}
          </p>
        </div>
      )}
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        accept=".txt"
        disabled={isUploading}
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