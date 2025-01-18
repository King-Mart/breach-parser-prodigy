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
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Breach Data Analyzer</h1>
          <p className="text-muted-foreground">
            Upload, analyze, and search through breach data securely.
          </p>
        </div>
        <img 
          src="/lovable-uploads/1abc1e8e-4752-421a-b217-232af70b0285.png" 
          alt="TADA DATA Logo" 
          className="h-8 w-auto object-contain"
        />
      </div>

      {!isSupabaseConfigured() && (
        <Alert variant="destructive">
          <AlertDescription>
            Supabase is not properly configured. Please set up your environment variables with valid Supabase credentials.
          </AlertDescription>
        </Alert>
      )}

      <UrlAnalyzer />

      <div className="grid gap-8 md:grid-cols-2">
        <FileUpload />
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Search</h2>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Data Overview</h2>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          <DataTable data={data} />
        )}
      </div>
    </div>
  );
}