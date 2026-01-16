import { User } from "@/core/domain/user/user";
import { UserState } from "@/utils/types";
declare class UserMapper {
    static toStateFromDomain(user: User): UserState;
    static toDomainFromState(state: UserState): User;
}
export default UserMapper;
//# sourceMappingURL=user.mapper.d.ts.map