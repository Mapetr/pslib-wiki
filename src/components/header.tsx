import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Authenticated, Unauthenticated } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useParams } from "@tanstack/react-router";

export default function Header() {
  const { documentId } = useParams({ strict: false });

  const { data, isPending, error } = useQuery(
    convexQuery(
      api.document.getDocument,
      documentId ? { id: documentId as Id<"documents"> } : "skip",
    ),
  );

  return (
    <header
      className={
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 left-0 z-50 flex h-10 w-full items-center gap-4 border-b px-2 backdrop-blur"
      }
    >
      <SidebarTrigger />
      <Authenticated>
        <Input className={"w-48 border-0 font-bold"} value={data?.name} />
      </Authenticated>
      <Unauthenticated>
        <span className={"font-bold"}>{data?.name}</span>
      </Unauthenticated>
    </header>
  );
}
