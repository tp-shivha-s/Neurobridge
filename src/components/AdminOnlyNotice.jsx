import { AlertTriangle } from "lucide-react";

export default function AdminOnlyNotice({ label = "This action is available in admin mode only." }) {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 dark:bg-amber-950/30 dark:border-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
      <AlertTriangle className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
}
