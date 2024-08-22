//@ts-nocheck

"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { formatMachineNames, parseText } from "@/lib/utils";
import { DataCombobox } from "./data-combobox";
import { CriteriaCombobox } from "./criteria-combobox"; // Import your new CriteriaCombobox

interface ComparatorOption {
  id: number;
  title: string;
  image: string;
  content: string;
  acf?: Record<string, any>;
}

interface DataComparatorProps {
  fetchData: () => Promise<{ data: ComparatorOption[]; totalItems: number }>;
  title: string;
  placeholder: string;
}

export function DataComparator({
  fetchData,
  title,
  placeholder,
}: DataComparatorProps) {
  const [comparatorOptions, setComparatorOptions] = useState<ComparatorOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<ComparatorOption[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>(["title", "description"]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await fetchData();
      setComparatorOptions(data.map((item) => ({
        id: item.id,
        title: item?.title || 'No title available',
        image: item.image || '',
        content: item?.content || '',
        acf: item?.acf || {},
      })));
    };
    loadData();
  }, [fetchData]);

  const handleCompare = () => {
    if (selectedOptions.length > 0) {
      setShowComparison(true);
    } else {
      alert("Please select at least one option to compare.");
    }
  };

  const handleCriteriaChange = (newCriteria: string[]) => {
    setSelectedCriteria(newCriteria);
  };

  const renderACFValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "N/A";
    }
    return value || "N/A";
  };

  const renderComparisonTable = () => {
    const acfKeys = new Set(
      selectedOptions.flatMap(option => Object.keys(option.acf || {}))
    );

    return (
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption>A comparison between the selected options.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] md:w-[200px] text-center"></TableHead>
              {selectedOptions.map(option => (
                <TableHead key={option.id} className="w-[300px] md:w-[400px] text-center">
                  <div className="flex flex-col items-center space-y-2">
                    {option.image && (
                      <Image
                        src={option.image}
                        alt={option.title}
                        width={80}
                        height={80}
                        className="mx-auto"
                      />
                    )}
                    <span>{parseText(option.title)}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedCriteria.includes("description") && (
              <TableRow>
                <TableCell>Description</TableCell>
                {selectedOptions.map(option => (
                  <TableCell key={option.id} className="align-top">
                    {parseText(option.content || '')}
                  </TableCell>
                ))}
              </TableRow>
            )}
            {Array.from(acfKeys).map((key) => (
              selectedCriteria.includes(key) && (
                <TableRow key={key}>
                  <TableCell>{formatMachineNames(key)}</TableCell>
                  {selectedOptions.map(option => (
                    <TableCell key={option.id}>{renderACFValue(option.acf?.[key])}</TableCell>
                  ))}
                </TableRow>
              )
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={selectedOptions.length + 1} className="text-center">Comparison completed.</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-start md:items-center mb-4">
        {/* DataCombobox - make it longer */}
        <div className="flex-1 w-full md:w-3/5">
          <DataCombobox
            options={comparatorOptions}
            onSelect={setSelectedOptions}
            placeholder={placeholder}
          />
        </div>
        
        {/* CriteriaCombobox - same width as the Compare button */}
        <div className="w-full md:w-1/5">
          <CriteriaCombobox
            criteria={[
              { id: 'description', label: 'Description' },
              ...Array.from(
                new Set(
                  comparatorOptions.flatMap(option => Object.keys(option.acf || {}))
                )
              ).map(key => ({
                id: key,
                label: formatMachineNames(key)
              }))
            ]}
            onCriteriaChange={handleCriteriaChange}
            placeholder="Select Criteria"
          />
        </div>

        {/* Compare button - same width as CriteriaCombobox */}
        <div className="w-full md:w-1/5">
          <Button onClick={handleCompare} className="w-full">
            Comparer
          </Button>
        </div>
      </div>
      {showComparison && renderComparisonTable()}
    </div>
  );
}
