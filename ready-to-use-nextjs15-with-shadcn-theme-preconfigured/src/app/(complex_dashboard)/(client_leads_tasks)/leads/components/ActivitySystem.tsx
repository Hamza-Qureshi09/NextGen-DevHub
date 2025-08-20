"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchActivities } from "@/server/actions";
import { LeadFilters } from "@/types/general";

interface ActivitySystemProps {
  filters: LeadFilters;
  initialActivities: any[] | null;
}

export default function ActivitySystem({
  filters,
  initialActivities,
}: ActivitySystemProps) {
  const payload = { ...filters, userId: "123" };

  const { data, isLoading, error } = useQuery<any[]>({
    queryKey: ["activities", filters],
    queryFn: () => fetchActivities(payload),
    initialData: initialActivities ?? undefined,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-red-600">
          Error loading activities. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {data.map((activity) => (
          <div key={activity.id} className="flex space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs">
                {activity.type[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500">
                Lead: {activity.leadId} •{" "}
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
