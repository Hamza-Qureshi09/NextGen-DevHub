"use client";
import { memo, useEffect, useState } from "react";

// TasksCountFilter component
export const TasksCountFilter = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    return (
      <input
        type="text"
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onChange(e.target.value);
          console.debug(`Tasks Count changed: ${e.target.value}`);
        }}
        placeholder="Tasks Count"
        className="p-2 border rounded"
      />
    );
  }
);
