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
    <div className="container py-8 space-y-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Plane className="h-8 w-8 text-blue-500 animate-bounce" />
            <h1 className="text-3xl font-bold tracking-tight text-blue-900">Breach Data Analyzer</h1>
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
          <Plane className="h-6 w-6 text-blue-400 transform rotate-45" />
        </div>
      </div>

      {!isSupabaseConfigured() && (
        <Alert variant="destructive">
          <AlertDescription>
            The flight deck is not properly configured. Please set up your environment variables with valid Supabase credentials.
          </AlertDescription>
        </Alert>
      )}

      <div className="p-6 bg-white rounded-lg shadow-lg border border-blue-100">
        <UrlAnalyzer />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-lg border border-blue-100">
          <FileUpload />
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg border border-blue-100 space-y-4">
          <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-500" />
            Quick Search
          </h2>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
          <Plane className="h-5 w-5 text-blue-500" />
          Flight Data Overview
        </h2>
        <div className="bg-white rounded-lg shadow-lg border border-blue-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <DataTable data={data} />
          )}
        </div>
      </div>
    </div>
  );
}