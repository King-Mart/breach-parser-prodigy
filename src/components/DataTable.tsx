import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { ExternalLink } from "lucide-react";

interface DataEntry {
  id: string;
  username: string;
  domain: string;
  url_path: string;
  application?: string;
  tags: string[];
  is_accessible: boolean;
  is_parked: boolean;
  breach_detected?: boolean;
}

interface DataTableProps {
  data: DataEntry[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id} className="group">
              <TableCell className="font-mono text-xs">{entry.id}</TableCell>
              <TableCell>{entry.username}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {entry.domain}
                  <a
                    href={`https://${entry.domain}${entry.url_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                  </a>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {entry.url_path}
              </TableCell>
              <TableCell>
                <StatusBadge 
                  status={
                    entry.is_parked 
                      ? "parked" 
                      : !entry.is_accessible 
                      ? "unresolved"
                      : entry.breach_detected 
                      ? "resolved" 
                      : "active"
                  } 
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}