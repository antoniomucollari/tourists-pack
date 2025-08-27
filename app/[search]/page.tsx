import { use } from 'react';


export default function Page(props: SearchPageProps ) {

    const search = use(props.params).search;
    // const search = resolvedParams.search;

    return <h1>Results for: {decodeURIComponent(search)}</h1>;
}

interface SearchPageProps {
    params: Promise<{ search: string }>;
}