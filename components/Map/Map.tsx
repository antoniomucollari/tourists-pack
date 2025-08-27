"use client";
import dynamic from 'next/dynamic';
import MapProps from "@/components/Map/MapProps";

// Dynamically import the MapComponent with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => <div className="loading">Loading Map...</div>
});

export default function Map(props: MapProps) {
    return <MapComponent {...props} />;
}