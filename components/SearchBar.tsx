"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react"; // using lucide for icon

export default function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!query.trim()) {
            // toggle input visibility if empty
            setOpen((prev) => !prev);
            return;
        }

        router.push(`/${encodeURIComponent(query)}`);
        console.log("Searching for:", query);

        // reset after search
        setQuery("");
        setOpen(false);
    };

    return (
        <form onSubmit={handleSearch} className="search-container">
            {open && (
                <input
                    type="text"
                    name="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                    placeholder="Search"
                    aria-label="Search"
                    autoFocus
                />
            )}
            <button
                type="submit"
                className="search-button"
                aria-label="Submit search"
            >
                <Search strokeWidth={1.5} />
            </button>
        </form>
    );
}