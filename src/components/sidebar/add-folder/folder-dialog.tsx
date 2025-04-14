import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";
import { useAtomValue } from "jotai/index";
import { activeCollectionAtom } from "../../../../atoms.ts";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils.ts";

export default function FolderDialog() {
  const inputRef = useRef(null as HTMLInputElement | null);
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.folder.createFolder),
  });
  const activeCollection = useAtomValue(activeCollectionAtom);

  const createFolder = () => {
    if (!inputRef.current || !inputRef.current.value) {
      return;
    }

    mutate({
      name: inputRef.current.value,
      collectionId: activeCollection._id,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add new folder</DialogTitle>
        <DialogDescription>
          Add a new folder to the current collection
        </DialogDescription>
      </DialogHeader>
      <div>
        <Input type={"text"} placeholder={"Name"} ref={inputRef} />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            type={"submit"}
            disabled={isPending}
            className={"cursor-pointer"}
            onClick={() => createFolder()}
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
