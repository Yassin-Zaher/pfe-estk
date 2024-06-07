import React, { useState } from "react";
import { Search } from "lucide-react"; // Importing the Search icon from lucid-react
import { Input } from "@/components/ui/input"; // Assuming shadcn's Input component is exported from this path
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  submitTo: string;
}

export default function SearchForm({ submitTo }: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const searchQuery = params.get("query") || "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!query) return;
        router.push(`${submitTo}${query}`);
      }}
      className="w-full"
    >
      <Input
        label="Search"
        icon={
          <button type="submit">
            {" "}
            {/* Ensure the button has type="submit" to trigger the form submission */}
            <Search className="h-5 w-5" />
          </button>
        }
        value={query || searchQuery}
        onChange={({ target }) => setQuery(target.value)}
      />
    </form>
  );
}
