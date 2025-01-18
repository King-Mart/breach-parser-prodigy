import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { SearchBar } from "@/components/SearchBar";
import { DataTable } from "@/components/DataTable";

const mockData = [
  {
    id: "1",
    domain: "example.com",
    ip: "192.168.1.1",
    url: "https://example.com/login",
    status: "active" as const,
    tags: ["wordpress", "login-form"],
  },
  {
    id: "2",
    domain: "test.org",
    ip: "10.0.0.1",
    url: "https://test.org/admin",
    status: "unresolved" as const,
    tags: ["citrix", "captcha"],
  },
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
          src="/your-logo.png" 
          alt="Company Logo" 
          className="h-8 w-auto object-contain"
        />
      </div>

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