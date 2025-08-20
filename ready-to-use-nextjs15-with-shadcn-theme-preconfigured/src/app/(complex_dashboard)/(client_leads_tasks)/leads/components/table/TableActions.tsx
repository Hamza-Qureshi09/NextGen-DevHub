"use client";

import { Button } from "@/components/ui/button";
import { Lead } from "@/types/general";

interface TableActionsProps {
  leadId: number;
  onUpdate: (updates: Partial<Lead>) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function TableActions({
  leadId,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: TableActionsProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onUpdate({ name: `Updated Lead ${leadId}` })}
        disabled={isUpdating}
      >
        Update
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        disabled={isDeleting}
      >
        Delete
      </Button>
    </div>
  );
}
