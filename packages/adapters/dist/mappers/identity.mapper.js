import { ProductId } from "@tbs/core";
export class ProductIdMapper {
    static toDomainFromState(productIdState) {
        return new ProductId(productIdState);
    }
    static toStateFromDomain(productId) {
        return productId.number;
    }
}
