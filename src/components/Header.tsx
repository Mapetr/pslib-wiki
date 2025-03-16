import { SidebarTrigger } from "@/components/ui/sidebar.tsx";

export default function Header({ name }: { name: string | undefined }) {
  return (
    <header
      className={
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky z-50 flex h-10 w-full items-center gap-4 border-b px-2 backdrop-blur"
      }
    >
      <SidebarTrigger />
      <span className={"font-bold"}>{name}</span>
    </header>
  );
}
