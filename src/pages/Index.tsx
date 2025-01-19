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
import { Plane, Shield, Lock, Database } from "lucide-react";

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
    <div className="min-h-screen bg-background bg-[url('/airplane-pattern.png')] bg-repeat bg-opacity-10">
      <div className="container py-8 space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/80 pointer-events-none" />
        
        <div className="relative space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary animate-pulse" />
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                  Breach Data Analyzer
                </h1>
              </div>
              <p className="text-muted-foreground">
                Navigate through breach data securely with our advanced analysis tools.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/1abc1e8e-4752-421a-b217-232af70b0285.png" 
                alt="TADA DATA Logo" 
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
              <Plane className="h-6 w-6 text-primary/80 floating-plane" />
            </div>
          </div>

          {!isSupabaseConfigured() && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
              <AlertDescription className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database connection not properly configured. Please set up your environment variables with valid Supabase credentials.
              </AlertDescription>
            </Alert>
          )}

          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 hover:border-primary/20 transition-colors">
            <UrlAnalyzer />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="group p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 hover:border-primary/20 transition-all duration-300">
              <FileUpload />
            </div>
            <div className="group p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 hover:border-primary/20 transition-all duration-300 space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
                Quick Search
              </h2>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Breached Data Overview
            </h2>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 hover:border-primary/20 transition-colors overflow-hidden">
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
      </div>
    </div>
  );
}