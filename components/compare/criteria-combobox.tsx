"use client"

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CriteriaOption {
  id: string;
  label: string;
}

interface CriteriaComboboxProps {
  criteria: CriteriaOption[];
  onCriteriaChange: (selectedCriteria: string[]) => void;
  placeholder: string;
  emptyMessage?: string;
}

export function CriteriaCombobox({
  criteria,
  onCriteriaChange,
  placeholder,
  emptyMessage = "No criteria found.",
}: CriteriaComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCriteria, setSelectedCriteria] = React.useState<string[]>([]);

  const toggleCriteria = (criteria: CriteriaOption) => {
    let updatedSelectedCriteria;
    if (selectedCriteria.includes(criteria.id)) {
      updatedSelectedCriteria = selectedCriteria.filter((id) => id !== criteria.id);
    } else {
      updatedSelectedCriteria = [...selectedCriteria, criteria.id];
    }
    setSelectedCriteria(updatedSelectedCriteria);
    onCriteriaChange(updatedSelectedCriteria);
  };

  const toggleSelectAll = () => {
    if (selectedCriteria.length === criteria.length) {
      // If all criteria are selected, deselect all
      setSelectedCriteria([]);
      onCriteriaChange([]);
    } else {
      // Otherwise, select all criteria
      const allCriteriaIds = criteria.map(criterion => criterion.id);
      setSelectedCriteria(allCriteriaIds);
      onCriteriaChange(allCriteriaIds);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCriteria.length > 0
            ? `${selectedCriteria.length} selected`
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {/* "Sélectionner tout" option */}
              <CommandItem
                onSelect={toggleSelectAll}
                className="flex items-center cursor-pointer"
              >
                Sélectionner tout
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedCriteria.length === criteria.length
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
              {criteria.length > 0 ? (
                criteria.map((criterion) => {
                  const isSelected = selectedCriteria.includes(criterion.id);
                  return (
                    <CommandItem
                      key={criterion.id}
                      value={criterion.label}
                      onSelect={() => toggleCriteria(criterion)}
                      className={cn(
                        "flex items-center cursor-pointer",
                        isSelected && "bg-blue-100" // Highlighting selected items
                      )}
                    >
                      {criterion.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })
              ) : (
                <div>{emptyMessage}</div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
