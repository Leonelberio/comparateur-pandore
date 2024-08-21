"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchAssurancesAll } from "@/lib/data";
import { AssuranceCombobox } from "./autocomplete";
import Image from "next/image";
import { parseText } from "@/lib/utils";

interface AssuranceOption {
  id: number;
  title: string;
  image: string;
  content: string;
}

export function AssuranceComparator() {
  const [assuranceOptions, setAssuranceOptions] = useState<AssuranceOption[]>([]);
  const [assurance1, setAssurance1] = useState<AssuranceOption | null>(null);
  const [assurance2, setAssurance2] = useState<AssuranceOption | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    // Fetch assurances when the component mounts
    const loadAssurances = async () => {
      const { data } = await fetchAssurancesAll(); // Fetch the data from the endpoint
      setAssuranceOptions(data.map((item: any) => ({
        id: item.id,
        title: item.title.rendered,
        image: item._embedded["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full?.source_url,
        content: item.content.rendered // Assuming description is in the API response
      })));
    };

    loadAssurances();
  }, []);

  const handleCompare = () => {
    if (assurance1 && assurance2) {
      console.log("Comparing:", assurance1, assurance2);
      setShowComparison(true);
    } else {
      alert("Please select both assurances to compare.");
    }
  };

  const renderComparisonTable = () => (
    <Table>
      <TableCaption>A comparison between the selected assurances.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]"> Feature</TableHead>
          <TableHead className="w-[400px]">Assurance 1</TableHead>
          <TableHead className="w-[400px]">Assurance 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Image</TableCell>
          <TableCell>
            {assurance1 && <Image src={assurance1.image} alt={assurance1.title} width={80} 
                        height={80}  />}
          </TableCell>
          <TableCell>
            {assurance2 && <Image src={assurance2.image} alt={assurance2.title}   width={80} 
                        height={80}  />}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>{assurance1?.title}</TableCell>
          <TableCell>{assurance2?.title}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell className="align-top">{parseText(assurance1?.content)}</TableCell>
          <TableCell className="align-top">{parseText(assurance2?.content)}</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Comparison completed.</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );

  return (
    <div className="p-6">
<h2>
  Comparer
  {assurance1?.title && assurance2?.title
    ? ` ${assurance1.title} vs ${assurance2.title}`
    : assurance1?.title
    ? ` ${assurance1.title}`
    : assurance2?.title
    ? ` ${assurance2.title}`
    : ''}
</h2>
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
        onClick={handleCompare}
      >
        Compare
      </Button>

      {showComparison && renderComparisonTable()}
    </div>
  );
}
