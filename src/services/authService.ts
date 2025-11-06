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
        const refreshToken = localStorage.getItem('refreshToken')
        return api.post("/auth/signout", { refreshToken });
    },

    getMe: async () => {
        const res = await api.get("/me/getme", { withCredentials: true });
        return res.data;
    },

    refresh: async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Không có refresh token");

        const res = await api.post("/auth/gettoken", { refreshToken });
        const { accessToken } = res.data;

        return accessToken;
    },
};