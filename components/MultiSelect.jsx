"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export function MultiSelect({
  field,
  label,
  options = [],
  placeholder = "Select items",
}) {
  // ensure it's always an array
  const selected = field.value || [];
  const selectedIds = selected.map((i) => i.id);

  const toggleSelect = (opt) => {
    if (selectedIds.includes(opt.id)) {
      // remove selected
      field.onChange(selected.filter((item) => item.id !== opt.id));
    } else {
      // add new
      field.onChange([...selected, opt]);
    }
  };

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}

      {/* Selected badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {selected.length > 0 ? (
          selected.map((opt) => (
            <Badge
              key={opt.id}
              variant="outline"
              className="flex items-center gap-1"
            >
              {opt.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleSelect(opt)}
              />
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No item selected</p>
        )}
      </div>

      {/* Dropdown / Command */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[250px]">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    onSelect={() => toggleSelect(opt)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(opt.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {opt.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <FormMessage />
    </FormItem>
  );
}
