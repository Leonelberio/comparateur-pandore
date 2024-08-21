"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchAssurances, fetchAssurancesAll } from "@/lib/data";
import { AssuranceCombobox } from "./autocomplete";


interface AssuranceOption {
    id: number;
    title: string;
    image: string;
  }
  

export function AssuranceComparator() {
  const [assuranceOptions, setAssuranceOptions] = useState<AssuranceOption[]>([]);
  const [assurance1, setAssurance1] = useState<AssuranceOption | null>(null);
  const [assurance2, setAssurance2] = useState<AssuranceOption | null>(null);

  useEffect(() => {
    // Fetch assurances when the component mounts
    const loadAssurances = async () => {
      const { data } = await fetchAssurancesAll(); // Fetch the data from the endpoint
      setAssuranceOptions(data.map((item: any) => ({
        id: item.id,
        title: item.title.rendered,
        image: item.image_url,
      })));
    };

    loadAssurances();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between space-x-4">
        <div className="w-1/2">
          <AssuranceCombobox
            options={assuranceOptions}
            onSelect={setAssurance1}
            placeholder="Select Assurance 1"
          />
        </div>
        <div className="w-1/2">
          <AssuranceCombobox
            options={assuranceOptions}
            onSelect={setAssurance2}
            placeholder="Select Assurance 2"
          />
        </div>
      </div>
      <Button
        variant="primary"
        className="mt-6 w-full"
        onClick={() => {
          if (assurance1 && assurance2) {
            console.log("Comparing:", assurance1, assurance2);
            // Implement the comparison logic here
          } else {
            alert("Please select both assurances to compare.");
          }
        }}
      >
        Compare
      </Button>
    </div>
  );
}
