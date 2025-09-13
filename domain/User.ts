
// import Roles from "@/domain/Roles";

import Roles from "@/domain/Roles";
import {Property} from "csstype";
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
