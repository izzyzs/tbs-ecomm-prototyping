import {Money} from "@tbs/core";

export class InventoryMapper {
    static toDomainFromDB() {}

    static priceDBtoDomain(price: number): Money {
        return new Money(price)
    }
}
