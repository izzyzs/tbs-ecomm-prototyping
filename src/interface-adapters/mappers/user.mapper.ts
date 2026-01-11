import { User } from "@/domain/user/user";
import Email from "@/domain/user/Email"
import { Role } from "@/domain/user/user";
import { UserId } from "@/domain/identity"
import { UserState } from "@/utils/types";

class UserMapper {
    static toStateFromDomain(user: User): UserState {
        const state: UserState = {
            id: user.id.value,
            email: user.email.value,
            isAuthenticated: user.isAuthenticated,
            role: user.role?.value ?? { role: "customer", kind: "standard" }
        }

        return state;
    }

    static toDomainFromState(state: UserState): User {
        const id = new UserId(state.id);
        const email = Email.create(state.email);
        const role = Role.create(state.role.role, state.role.kind);

        const user = new User(id, email, state.isAuthenticated, role);
        return user;
    }
}

export default UserMapper;