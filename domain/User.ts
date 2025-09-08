
// import Roles from "@/domain/Roles";

import Roles from "@/domain/Roles";

    export default interface User {
        name: string;
        email: string;
        phoneNumber: string;
        address: string;
        imageId: string;
        roles: string[];
    }
