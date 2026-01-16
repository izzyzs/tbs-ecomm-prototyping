import { User, Role } from "@tbs/core";
import { Email } from "@tbs/core";
import { UserId } from "@tbs/core";
export class UserStateMapper {
    static toStateFromDomain(user) {
        const state = {
            id: user.id.value,
            email: user.email.value,
            isAuthenticated: user.isAuthenticated,
            role: user.role?.value ?? { role: "customer", kind: "standard" },
        };
        return state;
    }
    static toDomainFromState(state) {
        const id = new UserId(state.id);
        const email = Email.create(state.email);
        const role = Role.create(state.role.role, state.role.kind);
        const user = new User(id, email, state.isAuthenticated, role);
        return user;
    }
}
