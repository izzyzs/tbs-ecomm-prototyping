import { UserId } from "@tbs/core";
export class UserMapper {
}
export class UserIdMapper {
    static stateToDomain(userId) {
        return new UserId(userId);
    }
}
