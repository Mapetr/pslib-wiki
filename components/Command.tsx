"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useDebouncedCallback } from "use-debounce";
import { searchDocument, SearchResult } from "@/app/actions";

export function Command() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(
    undefined as SearchResult[] | undefined,
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const updateSearch = useDebouncedCallback(async (search: string) => {
    const results = await searchDocument(search);
    setResults(results);
  }, 400);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type to search..."
        value={search}
        onValueChange={(search) => {
          console.log("change");
          setSearch(search);
          updateSearch(search);
        }}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Results">
          {results?.map((result) => (
            <CommandItem key={result.id}>{result.name}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
