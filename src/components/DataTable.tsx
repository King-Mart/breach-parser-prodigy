import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";

interface DataEntry {
  id: string;
  username: string;
  domain: string;
  ip_address?: string;
  application?: string;
  port?: number;
  url_path?: string;
  tags: string[];
  url_title?: string;
  login_form_detected: boolean;
  captcha_required: boolean;
  otp_required: boolean;
  is_parked: boolean;
  is_accessible: boolean;
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
            <TableHead>Username</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>Application</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.username}</TableCell>
              <TableCell>{entry.domain}</TableCell>
              <TableCell>{entry.ip_address || "N/A"}</TableCell>
              <TableCell>{entry.application || "Unknown"}</TableCell>
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
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
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