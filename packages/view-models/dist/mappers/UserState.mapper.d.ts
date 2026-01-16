import { User } from "@tbs/core";
import { UserState } from "../types/index.js";
export declare class UserStateMapper {
    static toStateFromDomain(user: User): UserState;
    static toDomainFromState(state: UserState): User;
}
//# sourceMappingURL=UserState.mapper.d.ts.map