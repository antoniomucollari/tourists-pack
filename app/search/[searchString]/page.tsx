
export default async function SearchPage({ params }: SearchPageProps) {
    const { searchString } = await params; // ✅ await params

    return (
        <div>
            <h1>Search Results for: {decodeURIComponent(searchString)}</h1>
            <p>You searched for: {decodeURIComponent(searchString)}</p>
        </div>
    );
}

interface SearchPageProps {
    params: Promise<{
        searchString: string;
    }>;
}
