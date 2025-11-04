"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

export function InvestorSelectMultiUserAdd({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce query for smooth UX
  //   useEffect(() => {
  //     const delayDebounce = setTimeout(() => {
  //       if (query.length >= 2) {
  //         fetchInvestors(query);
  //       }
  //     }, 400);
  //     return () => clearTimeout(delayDebounce);
  //   }, [query]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length === 0) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("investors")
        .select("id, name")
        .ilike("name", `%${query}%`)
        .limit(10);
      if (!error) setInvestors(data);
      setLoading(false);
      console.log({ query, data });
    }, 400); // debounce delay
    return () => clearTimeout(timeout);
  }, [query]);

  //   async function fetchInvestors(searchTerm) {
  //     setLoading(true);
  //     const { data, error } = await supabase
  //       .from("investors")
  //       .select("id, name")
  //       .ilike("name", `%${searchTerm}%`)
  //       .limit(20);

  //     if (!error) setInvestors(data || []);
  //     setLoading(false);
  //   }

  const selectedInvestor = investors.find((inv) => inv.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {selectedInvestor ? selectedInvestor.name : "Search investor"}
          <ChevronsUpDown className="opacity-50 h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Type to search investor..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && (
              <div className="p-2 text-sm text-muted-foreground">
                Searching...
              </div>
            )}
            {investors.length > 0 && (
              <>
                <CommandEmpty>No investor found.</CommandEmpty>
                <CommandGroup>
                  {investors.map((inv) => (
                    <CommandItem
                      key={inv.id}
                      value={inv.name.toLowerCase()}
                      onSelect={() => {
                        onChange(inv.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === inv.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {inv.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
