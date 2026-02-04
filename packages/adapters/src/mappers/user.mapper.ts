import { User, Role } from "@tbs/core";
import { Email } from "@tbs/core";
import { UserId } from "@tbs/core";


export class UserMapper {

}

export class UserIdMapper {
    static stateToDomain(userId: string): UserId {
        return new UserId(userId);
    }
}


