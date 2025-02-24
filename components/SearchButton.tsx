"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useSetAtom } from "jotai/index";
import { commandAtom } from "@/atoms";

export default function SearchButton() {
  const setOpen = useSetAtom(commandAtom);

  return (
    <Button
      className={"absolute right-4 top-2 md:right-4 md:top-4"}
      variant={"ghost"}
      size={"icon"}
      onClick={() => setOpen(true)}
    >
      <Search />
    </Button>
  );
}
