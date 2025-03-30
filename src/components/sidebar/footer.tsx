import { SidebarFooter } from "@/components/ui/sidebar.tsx";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button.tsx";

export default function Footer() {
  return (
    <SidebarFooter className={"flex flex-col"}>
      <Authenticated>
        <UserButton
          showName={true}
          appearance={{
            elements: {
              rootBox:
                "!w-full !h-8 transition-colors duration-250 rounded-md hover:bg-sidebar-accent",
              userButtonTrigger: "!w-full !aria-expanded:bg-sidebar-accent",
              userButtonBox: "!w-full !justify-between",
              userButtonOuterIdentifier: "!text-foreground !text-sm",
            },
          }}
        />
      </Authenticated>
      <Unauthenticated>
        <SignInButton>
          <Button className={"cursor-pointer"}>Sign in</Button>
        </SignInButton>
      </Unauthenticated>
    </SidebarFooter>
  );
}
