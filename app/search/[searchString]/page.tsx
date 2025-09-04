import { use } from 'react';


// This is a Server Component, so you can make it async
export default async function SearchPage({ params }: SearchPageProps) {
    const searchTerm = params.searchString;

    // You can now use the searchTerm to fetch data from your API
    // const results = await fetch(`https://api.example.com/search?q=${searchTerm}`);
    // const data = await results.json();

    return (
        <div>
            <h1>Search Results for: {decodeURIComponent(searchTerm)}</h1>
            {/* Display your search results here */}
            <p>You searched for: {decodeURIComponent(searchTerm)}</p>
        </div>
    );
}

interface SearchPageProps {
    params: {
        searchString: string; // This must match the folder name '[searchString]'
    };
}