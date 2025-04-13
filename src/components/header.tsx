import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useParams } from "@tanstack/react-router";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { Delete } from "@/components/header/delete.tsx";

export default function Header() {
  const updateName = useMutation(api.document.updateDocumentName);
  const { documentId } = useParams({ strict: false });
  const [name, setName] = useState("");

  const { data } = useQuery(
    convexQuery(
      api.document.getDocument,
      documentId ? { id: documentId as Id<"documents"> } : "skip",
    ),
  );

  useEffect(() => {
    setName(data?.name ?? "");
  }, [data]);

  const debounced = useDebouncedCallback((value: string) => {
    if (!data) return;
    if (value === "") {
      setName(data.name);
      return;
    }

    updateName({
      id: data._id,
      newName: value,
    });
  }, 1000);

  return (
    <header
      className={
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 left-0 z-50 flex h-10 w-full items-center justify-between gap-4 border-b px-2 backdrop-blur"
      }
    >
      <div className={"flex items-center"}>
        <SidebarTrigger />
        {data && (
          <div>
            <Authenticated>
              <Input
                className={"w-48 border-0 font-bold"}
                value={name}
                onChange={(e) => {
                  const name = e.target.value;
                  setName(name);
                  debounced(name);
                }}
              />
            </Authenticated>
            <Unauthenticated>
              <span className={"font-bold"}>{data?.name}</span>
            </Unauthenticated>
          </div>
        )}
      </div>
      {data && (
        <div className={"flex items-center"}>
          <Delete id={data._id} />
        </div>
      )}
    </header>
  );
}
