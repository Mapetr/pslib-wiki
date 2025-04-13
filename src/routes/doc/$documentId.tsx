import { createFileRoute } from "@tanstack/react-router";
import { Editor } from "@/components/editor.tsx";

export const Route = createFileRoute("/doc/$documentId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { documentId } = Route.useParams();

  return (
    <div className={"h-full"}>
      <Editor key={documentId} id={documentId} />
    </div>
  );
}
