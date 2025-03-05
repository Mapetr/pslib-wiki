import "./App.css";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useRef } from "react";
import { api } from "../convex/_generated/api";

function App() {
  return (
    <>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
        <Content />
      </Authenticated>
    </>
  );
}

function Content() {
  const addCollection = useMutation(api.tasks.createCollection);
  const input = useRef(null as HTMLInputElement | null);

  return (
    <div>
      <input type={"text"} ref={input} />
      <button
        onClick={async () => {
          if (!input.current || input.current.value === "") return;

          await addCollection({ name: input.current?.value });
        }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
