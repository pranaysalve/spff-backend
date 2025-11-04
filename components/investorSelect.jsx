import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export function InvestorSelect({ control }) {
  const [investors, setInvestors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchTerm.trim().length === 0) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("investors")
        .select("id, name")
        .ilike("name", `%${searchTerm}%`)
        .limit(10);
      if (!error) setInvestors(data);
      setLoading(false);
    }, 400); // debounce delay
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <FormField
      control={control}
      name="investor_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Investor</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? investors.find((inv) => inv.id === field.value)?.name ||
                      "Loading..."
                    : "Select an investor"}
                  <ChevronsUpDown className="opacity-50 h-4 w-4 ml-2" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search investor..."
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  {loading && (
                    <div className="p-2 text-sm text-muted-foreground">
                      Searching...
                    </div>
                  )}
                  {!loading && (
                    <>
                      <CommandEmpty>No investor found.</CommandEmpty>
                      <CommandGroup>
                        {investors.map((inv) => (
                          <CommandItem
                            key={inv.id}
                            value={inv.name.toLowerCase()}
                            onSelect={() => field.onChange(inv.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === inv.id
                                  ? "opacity-100"
                                  : "opacity-0"
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
