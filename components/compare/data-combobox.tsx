"use client"

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn, parseText } from "@/lib/utils";
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
import Image from "next/image";

interface DataOption {
  id: number;
  title: string;
  image?: string;
  [key: string]: any; // Additional dynamic properties
}

interface ComboboxProps {
  options: DataOption[];
  onSelect: (options: DataOption[]) => void;
  placeholder: string;
  emptyMessage?: string;
}

export function DataCombobox({
  options,
  onSelect,
  placeholder,
  emptyMessage = "No options found.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedOptions, setSelectedOptions] = React.useState<DataOption[]>([]);

  const toggleOption = (option: DataOption) => {
    let updatedSelectedOptions;
    if (selectedOptions.find((item) => item.id === option.id)) {
      updatedSelectedOptions = selectedOptions.filter((item) => item.id !== option.id);
    } else {
      updatedSelectedOptions = [...selectedOptions, option];
    }
    setSelectedOptions(updatedSelectedOptions);
    onSelect(updatedSelectedOptions); // Notify parent component of the selected options
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
          {selectedOptions.length > 0
            ? `${selectedOptions.length} sélectionnés`
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
              {options.length > 0 ? (
                options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.title}
                    onSelect={() => toggleOption(option)}
                    className="flex items-center"
                  >
                    {option.image && (
                      <Image
                        src={option.image}
                        alt={option.title}
                        width={24}
                        height={24}
                        className="w-6 h-6 mr-2 rounded"
                      />
                    )}
                    {parseText(option.title)}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedOptions.find((item) => item.id === option.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              ) : (
                <div>Aucune donnée trouvée</div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
