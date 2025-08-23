import {Search} from "lucide-react";
import {FormEvent} from "react";
import { useRouter } from "next/navigation";

export default function SearchBar(){
    const router = useRouter();
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
            search: { value: string };
        };

            const query = formElements.search.value;
        if (query) {
            router.push(`/${query}`);
        }
        console.log("Searching for:", query);
    };

    return (
        <form onSubmit={handleSearch} className="search-container">
            <input
                type="text"
                name="search"
                className="search-input"
                placeholder="Search"
                aria-label="Search"
            />
            <button type="submit" className="search-button" aria-label="Submit search">
                <Search strokeWidth={1.5} />
            </button>
        </form>
    );
}