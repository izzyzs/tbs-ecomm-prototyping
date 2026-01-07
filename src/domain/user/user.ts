// user.ts

import Email from "@/domain/user/Email";
import { UserId } from "@/domain/identity"

export class User {  
    constructor(
        public id: UserId,
        public email: Email,
        // private isAdminBoolean: boolean,
    ) {
    
    }

    // get isAdmin() {
    //     return this.isAdminBoolean;
    // }
}
