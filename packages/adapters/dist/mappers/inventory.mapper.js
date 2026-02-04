import { Money } from "@tbs/core";
export class InventoryMapper {
    static toDomainFromDB() { }
    static priceDBtoDomain(price) {
        return new Money(+price.replace(/\$|\./g, ""));
    }
}
