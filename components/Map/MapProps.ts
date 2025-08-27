import Coordinate from "@/components/Map/coordinate.model";

export default interface MapProps {
    coordinates?: Coordinate[];
    CoordinateProp?: (coordinate: Coordinate) => void;
    notAllowClicks?: boolean;
}