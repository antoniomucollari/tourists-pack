
// import Roles from "@/domain/Roles";
import Order from "@/domain/Order";


    export default interface User {
        name: string;
        email: string;
        phoneNumber: string;
        address: string;
        imageId: string;
        roles: string[];
        profileUrl?: string;
        lastOrder?: Order;
    }
