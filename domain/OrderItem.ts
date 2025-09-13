import Packet from "@/domain/Packet";

 export default interface OrderItem {
     id: number;
     quantity: number;
     packet: Packet;
     pricePerUnit: number;
     subTotal: number;
 }
