//@ts-nocheck

"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { formatMachineNames, parseText } from "@/lib/utils";
import { DataCombobox } from "./data-combobox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  const [selectedCriteria, setSelectedCriteria] = useState<Set<string>>(new Set(["title", "description"]));
  const [showComparison, setShowComparison] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await fetchData();
      setComparatorOptions(data?.map((item) => ({
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

  const handleCriteriaChange = (criterion: string) => {
    setSelectedCriteria(prev => {
      const newCriteria = new Set(prev);
      if (newCriteria.has(criterion)) {
        newCriteria.delete(criterion);
      } else {
        newCriteria.add(criterion);
      }
      return newCriteria;
    });
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
            {selectedCriteria.has("description") && (
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
              selectedCriteria.has(key) && (
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
        <div className="flex-1 w-full">
          <DataCombobox
            options={comparatorOptions}
            onSelect={setSelectedOptions}
            placeholder={placeholder}
          />
        </div>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">Critères</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={selectedCriteria.has("description")}
              onCheckedChange={() => handleCriteriaChange("description")}
              onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
            >
              Description
            </DropdownMenuCheckboxItem>
            {Array.from(
              new Set(
                comparatorOptions.flatMap(option => Object.keys(option.acf || {}))
              )
            ).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={selectedCriteria.has(key)}
                onCheckedChange={() => handleCriteriaChange(key)}
                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
              >
                {formatMachineNames(key)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleCompare} className="w-full md:w-auto">
          Comparer
        </Button>
      </div>
      {showComparison && renderComparisonTable()}
    </div>
  );
}
