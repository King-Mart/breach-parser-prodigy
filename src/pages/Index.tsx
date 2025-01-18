import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { SearchBar } from "@/components/SearchBar";
import { DataTable } from "@/components/DataTable";
import { UrlAnalyzer } from "@/components/UrlAnalyzer";
import { fetchDatabaseRows } from "@/api/database";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      const rows = await fetchDatabaseRows();
      if (rows && rows.length > 0) {
        const formattedData = rows.map(row => ({
          id: row.id || String(Math.random()),
          username: row.username || "unknown",
          domain: row.domain || row.hostname || "example.com",
          ip_address: row.ip_address || "N/A",
          application: row.application || "Unknown",
          tags: row.tags ? JSON.parse(row.tags) : ["untagged"],
          login_form_detected: row.login_form_detected || false,
          captcha_required: row.captcha_required || false,
          otp_required: row.otp_required || false,
          is_parked: row.is_parked || false,
          is_accessible: row.is_accessible || true,
          breach_detected: row.breach_detected || false
        }));
        setData(formattedData);
        toast({
          title: "Data Loaded",
          description: `Successfully fetched ${formattedData.length} rows from database`,
        });
      }
    };

    loadData();
  }, []);

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
        <DataTable data={data} />
      </div>
    </div>
  );
}