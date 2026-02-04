import {Money} from "@tbs/core";

export class InventoryMapper {
    static toDomainFromDB() {}

    static priceDBtoDomain(price: string): Money {
        return new Money(+price.replace(/\$|\./g, ""))
    }
}
