import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { SearchBar } from "@/components/SearchBar";
import { DataTable } from "@/components/DataTable";
import { UrlAnalyzer } from "@/components/UrlAnalyzer";

const mockData = [
  {
    id: "1",
    username: "admin",
    domain: "example.com",
    ip_address: "192.168.1.1",
    application: "WordPress",
    port: 443,
    url_path: "/wp-admin",
    tags: ["wordpress", "admin-panel"],
    url_title: "WordPress Admin",
    login_form_detected: true,
    captcha_required: false,
    otp_required: true,
    is_parked: false,
    is_accessible: true,
    breach_detected: false
  }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data] = useState(mockData);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Here we would implement the actual search logic
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