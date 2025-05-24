import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Dispatch, SetStateAction, useRef } from "react";
import { api } from "../../../../convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { useAtomValue } from "jotai";
import { activeCollectionAtom } from "../../../../atoms.ts";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils.ts";

export default function DocumentDialog({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const activeCollection = useAtomValue(activeCollectionAtom);
  const onSuccess = (data: string) => {
    console.log(data);
    if (!data) return;

    window.history.pushState({}, "", `/${activeCollection._id}/${data}`);
  };

  const inputRef = useRef(null as HTMLInputElement | null);
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.document.createDocument),
    onSuccess: onSuccess,
  });

  const createDocument = () => {
    if (!inputRef.current || !inputRef.current.value) {
      return;
    }

    mutate({
      name: inputRef.current.value,
      collectionId: activeCollection._id,
    });

    setOpen(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add new document</DialogTitle>
        <DialogDescription>
          Add a new document to the current collection
        </DialogDescription>
      </DialogHeader>
      <div>
        <Input
          type={"text"}
          placeholder={"Name"}
          ref={inputRef}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;

            createDocument();
          }}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            type={"submit"}
            disabled={isPending}
            className={"cursor-pointer"}
            onClick={() => createDocument()}
          >
            <Loader2
              className={cn("animate-spin", isPending ? "" : "hidden")}
            />
            Create
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
