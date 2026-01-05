// user.ts

import { Cart } from "../cart/cart"
import { UserId } from "../identity"

export class User {  
    constructor(
        public id: UserId,
        public email: string,
        public username: string,
        private isAdminBoolean: boolean,
    ) {
    
    }

    get isAdmin() {
        return this.isAdminBoolean;
    }

    
}
