import { LocalCartRepository } from "@/domain/repositories/cart/LocalCartRepository";
import { AuthenticatedCartRepository } from "@/domain/repositories/cart/AuthenticatedCartRepository";

export interface CartGateway {

}

export class DefaultCartGateway implements CartGateway {
    constructor(
        private localCartRepository: LocalCartRepository,
        private authenticatedCartRepository: AuthenticatedCartRepository 
    ) {
        
    }

    
}