// This interface now ONLY contains fields specific to a packet.
export default interface Packet {
    duration: number;
    isPopular: boolean;
    features: string[];
}