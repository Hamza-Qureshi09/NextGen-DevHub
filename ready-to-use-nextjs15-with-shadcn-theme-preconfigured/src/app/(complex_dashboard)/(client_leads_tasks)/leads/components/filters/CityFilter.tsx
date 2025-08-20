"use client";

import { getCities } from "@/server/test";
import { useQuery } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";

// CityFilter component
const CityFilter = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => {
    const [localValue, setLocalValue] = useState(value);
    const { data, isLoading, error } = useQuery({
      queryKey: ["cities"],
      queryFn: getCities,
      staleTime: Infinity,
    });

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    if (isLoading)
      return <div className="p-2 border rounded">Loading cities...</div>;
    if (error)
      return (
        <div className="p-2 border rounded text-red-500">
          Error: {error.message}
        </div>
      );

    return (
      <select
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onChange(e.target.value);
          console.debug(`City changed: ${e.target.value}`);
        }}
        className="p-2 border rounded"
      >
        <option value="">All Cities</option>
        {data?.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  }
);

export default CityFilter;
