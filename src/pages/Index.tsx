import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { SearchBar } from "@/components/SearchBar";
import { DataTable } from "@/components/DataTable";
import { UrlAnalyzer } from "@/components/UrlAnalyzer";
import { fetchDatabaseRows } from "@/api/database";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Plane } from "lucide-react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchDatabaseRows,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data from database",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container py-8 space-y-8 bg-background bg-[url('/airplane-pattern.png')] bg-repeat">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Plane className="h-8 w-8 text-primary animate-bounce" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Breach Data Analyzer</h1>
          </div>
          <p className="text-muted-foreground">
            Soar through breach data securely with our aviation-grade analysis tools.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/1abc1e8e-4752-421a-b217-232af70b0285.png" 
            alt="TADA DATA Logo" 
            className="h-8 w-auto object-contain"
          />
          <Plane className="h-6 w-6 text-primary/80 floating-plane" />
        </div>
      </div>

      {!isSupabaseConfigured() && (
        <Alert variant="destructive">
          <AlertDescription>
            The flight deck is not properly configured. Please set up your environment variables with valid Supabase credentials.
          </AlertDescription>
        </Alert>
      )}

      <div className="p-6 bg-card rounded-lg shadow-lg border border-border">
        <UrlAnalyzer />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-6 bg-card rounded-lg shadow-lg border border-border">
          <FileUpload />
        </div>
        <div className="p-6 bg-card rounded-lg shadow-lg border border-border space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            Quick Search
          </h2>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Plane className="h-5 w-5 text-primary" />
          Flight Data Overview
        </h2>
        <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <DataTable data={data} />
          )}
        </div>
      </div>
    </div>
  );
}