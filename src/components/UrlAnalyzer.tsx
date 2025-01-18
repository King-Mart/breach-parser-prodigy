import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function UrlAnalyzer() {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze URL");
      }

      toast({
        title: "Success",
        description: "URL analysis completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">URL Analysis</h2>
      <div className="flex items-center gap-4">
        <Input
          type="url"
          placeholder="Enter URL to analyze..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAnalyze}>
          <Play className="mr-2 h-4 w-4" />
          Analyze
        </Button>
      </div>
    </div>
  );
}