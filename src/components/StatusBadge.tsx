import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "resolved" | "parked" | "unresolved";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  const statusStyles = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    resolved: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    parked: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    unresolved: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <span className={cn(baseStyles, statusStyles[status], className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}