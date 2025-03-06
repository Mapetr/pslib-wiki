import { SidebarTrigger } from "@/components/ui/sidebar.tsx";

export default function Header() {
  return (
    <header
      className={
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky z-50 flex h-10 w-full items-center border-b px-2 backdrop-blur"
      }
    >
      <SidebarTrigger />
    </header>
  );
}
