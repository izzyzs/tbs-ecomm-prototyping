import { ProductId } from "@tbs/core";

export class ProductIdMapper {
    static toDomainFromState(productIdState: number) {
        return new ProductId(productIdState);
    }

    static toStateFromDomain(productId: ProductId) {
        return productId.number;
    }
}