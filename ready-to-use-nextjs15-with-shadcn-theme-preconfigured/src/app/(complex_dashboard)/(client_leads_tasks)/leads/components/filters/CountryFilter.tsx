"use client";

import { getCountries } from "@/server/test";
import { useQuery } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";

// CountryFilter component
const CountryFilter = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => {
    const [localValue, setLocalValue] = useState(value);
    const { data, isLoading, error } = useQuery({
      queryKey: ["countries"],
      queryFn: getCountries,
      staleTime: Infinity,
    });

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    if (isLoading)
      return <div className="p-2 border rounded">Loading countries...</div>;
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
          console.debug(`Country changed: ${e.target.value}`);
        }}
        className="p-2 border rounded"
      >
        <option value="">All Countries</option>
        {data?.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  }
);

export default CountryFilter;
