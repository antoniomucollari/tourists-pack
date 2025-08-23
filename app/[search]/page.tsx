export default async function SearchString({ params }: UserPageProps) {
    const { search } = await params; // await params before using
    return (
        <>
            {decodeURIComponent(search)}
        </>
    );
}

interface UserPageProps {
    params: Promise<{
        search: string;
    }>;
}