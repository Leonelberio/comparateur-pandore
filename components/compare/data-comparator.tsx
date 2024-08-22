"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { formatMachineNames, parseText } from "@/lib/utils";
import { DataCombobox } from "./data-combobox";

interface ComparatorOption {
  id: number;
  title: string;
  image: string;
  content: string;
  acf?: Record<string, any>; // Added to handle ACF fields
  _embedded?: {
    "wp:featuredmedia"?: {
      media_details?: {
        sizes?: {
          full?: {
            source_url: string;
          };
        };
      }[];
    }[];
  };
}

interface DataComparatorProps {
  fetchData: () => Promise<{ data: ComparatorOption[]; totalItems: number }>;
  title: string;
  placeholder1: string;
  placeholder2: string;
}

export function DataComparator({
  fetchData,
  title,
  placeholder1,
  placeholder2,
}: DataComparatorProps) {
  const [comparatorOptions, setComparatorOptions] = useState<ComparatorOption[]>([]);
  const [option1, setOption1] = useState<ComparatorOption | null>(null);
  const [option2, setOption2] = useState<ComparatorOption | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await fetchData();
      setComparatorOptions(data?.map((item) => ({
        id: item.id,
        title: item?.title || 'No title available',
        image: item.image || '',
        content: item?.content || '',
        acf: item?.acf || {},  // Store ACF fields
      })));
    };
  
    loadData();
  }, [fetchData]);

  const handleCompare = () => {
    if (option1 && option2) {
      setShowComparison(true);
    } else {
      alert("Please select both options to compare.");
    }
  };

  const renderACFValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "N/A";
    }
    return value || "N/A";
  };

  const renderComparisonTable = () => {
    // Combine the keys from both option1 and option2 ACF fields
    const acfKeys = new Set([
      ...Object.keys(option1?.acf || {}),
      ...Object.keys(option2?.acf || {}),
    ]);

    return (
      <Table>
        <TableCaption>A comparison between the selected options.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]"> Feature</TableHead>
            <TableHead className="w-[400px]">Option 1</TableHead>
            <TableHead className="w-[400px]">Option 2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>
              {option1 && <Image src={option1.image} alt={option1.title} width={80} height={80} />}
            </TableCell>
            <TableCell>
              {option2 && <Image src={option2.image} alt={option2.title} width={80} height={80} />}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>{option1?.title}</TableCell>
            <TableCell>{option2?.title}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell className="align-top">{parseText(option1?.content || '')}</TableCell>
            <TableCell className="align-top">{parseText(option2?.content || '')}</TableCell>
          </TableRow>

          {/* Dynamically render ACF fields */}
          {Array.from(acfKeys).map((key) => (
            <TableRow key={key}>
              <TableCell>{formatMachineNames(key)}</TableCell>
              <TableCell>{renderACFValue(option1?.acf[key])}</TableCell>
              <TableCell>{renderACFValue(option2?.acf[key])}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Comparison completed.</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  };

  return (
    <div className="p-6">
      <h2>
        Comparer
        {option1?.title && option2?.title
          ? ` ${option1.title} vs ${option2.title}`
          : option1?.title
          ? ` ${option1.title}`
          : option2?.title
          ? ` ${option2.title}`
          : ''}
      </h2>
      <div className="flex justify-between space-x-4">
        <div className="w-full md:w-1/2">
          <DataCombobox
            options={comparatorOptions}
            onSelect={setOption1}
            placeholder="Select Option 1"
          />
        </div>
        <div className="w-full md:w-1/2">
          <DataCombobox
            options={comparatorOptions}
            onSelect={setOption2}
            placeholder="Select Option 2"
          />
        </div>
      </div>
      <Button
        className="mt-6"
        onClick={handleCompare}
      >
        Comparer
      </Button>

      {showComparison && renderComparisonTable()}
    </div>
  );
}
