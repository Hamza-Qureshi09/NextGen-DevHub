"use client";

import { memo, useEffect, useState } from "react";

// BySelect component
export const BySelect = memo(
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
      <select
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          onChange(e.target.value);
          console.debug(`By changed: ${e.target.value}`);
        }}
        className="p-2 border rounded"
      >
        <option value="">Select Filter By</option>
        <option value="name">Name</option>
        <option value="email">Email</option>
      </select>
    );
  }
);

// ValueInput component
export const ValueInput = memo(
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
          console.debug(`Value changed: ${e.target.value}`);
        }}
        placeholder="Value"
        className="p-2 border rounded"
      />
    );
  }
);
