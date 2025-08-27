'use client'
import { useRouter } from "next/router";
export default function SearchPage() {
    const { query } = useRouter();
    return <h1>Results for: {decodeURIComponent(query.searchstring as string)}</h1>;
}