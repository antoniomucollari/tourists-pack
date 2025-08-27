"use client";
import type {LatLngTuple} from "leaflet";
import {MapContainer, Marker, Popup, TileLayer, useMapEvent} from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import {useEffect, useRef, useState} from "react";
import Coordinate from "@/components/Map/coordinate.model";
import MapProps from "@/components/Map/MapProps";

// This component will only be loaded on the client side
export default function MapComponent(props: MapProps){
    const markerRef = useRef<LeafletMarker>(null);
    

    useEffect(() => {
        L.Icon.Default.mergeOptions({
            iconUrl,
            iconRetinaUrl,
            shadowUrl,
        });
    }, []);
    
    const [coordinates, setCoordinates] = useState(props.coordinates);
    const first = coordinates?.[0];
    const CordinateArr: LatLngTuple | undefined = first ? [first.lat, first.lng] : undefined;
    
    return (
        <MapContainer center={CordinateArr?? [41.32393628568503, 19.789409570999812]} zoom={13} scrollWheelZoom={true} style={{height:'500px'}}>
            <TileLayer attribution="React Movies" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

            {!props.notAllowClicks? <HandleMapClick setCoordinate={cordi=>{
                setCoordinates([cordi])
                if (props.CoordinateProp){
                    props.CoordinateProp(cordi)
                }
            }} /> : undefined}
            {coordinates?.map((coordinate) => <Marker ref={markerRef} position={[coordinate.lat, coordinate.lng]} key={coordinate.lat + coordinate.lng}>
                {coordinate.message ? <Popup>{coordinate.message}</Popup> : undefined}
            </Marker>)}
        </MapContainer>
    )
}

function HandleMapClick(props: {setCoordinate(coordinate: Coordinate):void}){
    useMapEvent('click',e=>{
        props.setCoordinate({lat: e.latlng.lat, lng: e.latlng.lng})
    })
    return null
}