"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lead, LeadFilters, LeadsData } from "@/types/general";
import { updateLead, deleteLead } from "@/server/test";
import { TableCell, TableRow } from "@/components/ui/table";
import { TableActions } from "./TableActions";
import { Skeleton } from "@/components/ui/skeleton";

interface LeadTableRowProps {
  lead: Lead;
  filters: LeadFilters;
  refetch: () => void;
}

export default function LeadTableRow({
  lead,
  filters,
  refetch,
}: LeadTableRowProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Lead> }) =>
      updateLead(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["leads", filters] });
      const previousData = queryClient.getQueryData<LeadsData>([
        "leads",
        filters,
      ]);
      if (previousData) {
        queryClient.setQueryData<LeadsData>(["leads", filters], {
          ...previousData,
          data: {
            ...previousData.data,
            leads: previousData.data.leads.map((l) =>
              l.id === id ? { ...l, ...updates } : l
            ),
          },
        });
        return { previousData };
      }
      return {};
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(["leads", filters], context?.previousData);
    },
    onSuccess: async () => {
      //   queryClient.invalidateQueries({ queryKey: ["leads", filters] });

      //   If you want to force a fresh fetch immediately instead of marking stale,
      await queryClient.refetchQueries({ queryKey: ["leads", filters] });

      //   OR Refetch
      //  refetch(); // directly call refetch
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteLead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["leads", filters] });
      const previousData = queryClient.getQueryData<LeadsData>([
        "leads",
        filters,
      ]);
      if (previousData) {
        queryClient.setQueryData<LeadsData>(["leads", filters], {
          ...previousData,
          data: {
            ...previousData.data,
            leads: previousData.data.leads.filter((l) => l.id !== id),
          },
          totalItems: previousData.totalItems - 1,
          totalPages: Math.ceil(
            (previousData.totalItems - 1) / (filters.pageSize || 10)
          ),
        });
        return { previousData };
      }
      return {};
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["leads", filters], context?.previousData);
    },
    onSuccess: async () => {
      //   queryClient.invalidateQueries({ queryKey: ["leads", filters] });

      //   queryClient.removeQueries({ queryKey: ["leads", filters] });

      // OR Refetch
      refetch(); // directly call refetch
    },
  });

  if (updateMutation.isPending || deleteMutation.isPending) {
    return (
      <TableRow>
        <TableCell colSpan={9}>
          <Skeleton className="h-8 w-full" />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      <TableRow>
        <TableCell>{lead.id}</TableCell>
        <TableCell>{lead.name}</TableCell>
        <TableCell>{lead.email}</TableCell>
        <TableCell>{lead.country}</TableCell>
        <TableCell>{lead.city}</TableCell>
        <TableCell>{lead.project}</TableCell>
        <TableCell>{lead.tasksCount}</TableCell>
        <TableCell>{lead.value}</TableCell>
        <TableCell>
          <TableActions
            leadId={lead.id}
            onUpdate={(updates) =>
              updateMutation.mutate({ id: lead.id, updates })
            }
            onDelete={() => deleteMutation.mutate(lead.id)}
            isUpdating={updateMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
