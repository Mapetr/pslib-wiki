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
import { CommandLoading } from "cmdk";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { commandAtom } from "@/atoms";

export function Command() {
  const [open, setOpen] = useAtom(commandAtom);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([] as SearchResult[]);
  const router = useRouter();

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
    setLoading(false);
    if (!results) return;
    setResults(results);
  }, 200);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type to search..."
        value={search}
        onValueChange={(search) => {
          setLoading(true);
          setSearch(search);
          updateSearch(search);
        }}
      />
      <CommandList>
        {loading && (
          <CommandLoading
            className={
              "mt-2 flex w-full justify-center text-sm text-muted-foreground"
            }
          >
            Searching...
          </CommandLoading>
        )}
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Results">
          {results.map((result) => (
            <CommandItem
              key={result.id}
              value={result.id}
              onSelect={(value) => {
                router.push(`/doc/${value}`);
                setOpen(false);
                setSearch("");
                setResults([]);
              }}
            >
              {result.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
