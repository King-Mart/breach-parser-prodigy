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
  domain: string;
  ip?: string;
  url: string;
  status: "active" | "resolved" | "parked" | "unresolved";
  tags: string[];
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
            <TableHead>Domain</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.domain}</TableCell>
              <TableCell>{entry.ip || "N/A"}</TableCell>
              <TableCell className="max-w-md truncate">{entry.url}</TableCell>
              <TableCell>
                <StatusBadge status={entry.status} />
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