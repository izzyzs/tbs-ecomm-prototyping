import { ProductId } from "@/core/domain/identity";

export class ProductIdMapper {
    static toDomainFromState(productIdState: number) {
        return new ProductId(productIdState);
    }

    static toStateFromDomain(productId: ProductId) {
        return productId.number;
    }
}