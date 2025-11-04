"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
export default function InvestorSearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  // 🔍 Fetch investors when query changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setInvestors([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("investors")
        .select("id, name, tagline, domain")
        .ilike("name", `%${query}%`)
        .limit(10);

      if (!error && data) setInvestors(data);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, supabase]);
  console.log({ investors });
  return (
    <div className="relative w-full max-w-full">
      {/* 🔹 Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search investors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)} // small delay to allow click
          className="pl-9"
        />
      </div>

      {/* 🔹 Search results dropdown */}
      {focused && query.length >= 2 && (
        <Card className="absolute top-12 left-0 w-full z-10 shadow-md border bg-background">
          {loading ? (
            <div className="flex items-center justify-center py-3 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Searching...
            </div>
          ) : investors.length > 0 ? (
            <ScrollArea className="h-96 rounded-md border">
              <ul className="divide-y">
                {investors.map((inv) => (
                  <li
                    key={inv.id}
                    onClick={() =>
                      router.push(`/dashboard/investor-profile/${inv.id}`)
                    }
                    className="p-3 hover:bg-muted cursor-pointer transition-colors"
                  >
                    <p className="font-medium">{inv.name}</p>
                    {inv.tagline && (
                      <p className="text-sm text-muted-foreground truncate">
                        {inv.tagline}
                      </p>
                    )}
                    {inv.domain && (
                      <p className="text-sm font-semibold truncate">
                        {inv.domain}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <div className="p-3 text-sm text-muted-foreground">
              No investors found.
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
