import type { User } from "./User";
import type { Class } from "./Class";

export interface AuthState {
    accessToken: string | null;
    loading: boolean;

    user: User | null;

    classes: Class[];

    setAccessToken: (accessToken: string) => void;
    clearState: () => void;
    signUp: (
        username: string,
        password: string,
        email: string,
        lastname: string,
        firstname: string,
        gender: string,
        birth: string
    ) => Promise<void>
    signIn: (
        username: string,
        password: string
    ) => Promise<void>
    signOut: () => Promise<void>;
    getMe: () => Promise<void>;
    refresh: () => Promise<void>;
    getClass: () => Promise<void>;
    getClassInfo: (id: string) => Promise<void>;
}