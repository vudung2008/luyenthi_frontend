import api from "@/lib/axios";

export const authService = {
    signUp: async (
        username: string,
        password: string,
        email: string,
        firstName: string,
        lastName: string,
        gender: string,
        birth: string
    ) => {
        const res = await api.post(
            "/auth/signup",
            { username, password, email, firstName, lastName, gender, birth },
            { withCredentials: true }
        );

        return res.data;
    },

    signIn: async (username: string, password: string) => {
        const res = await api.post(
            "auth/signin",
            { username, password },
            { withCredentials: true }
        );
        return res.data; // access token
    },

    signOut: async () => {
        return api.post("/auth/signout", { withCredentials: true });
    },

    getMe: async () => {
        const res = await api.get("/me/getme", { withCredentials: true });
        return res.data;
    },

    refresh: async () => {
        const res = await api.get("/auth/gettoken", { withCredentials: true });
        return res.data.accessToken;
    },
};