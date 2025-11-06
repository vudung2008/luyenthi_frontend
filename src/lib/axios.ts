import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:3001/"
            : "https://luyenthi-backend.onrender.com/",
    withCredentials: false, // ❌ Không cần nữa vì không dùng cookie
});

// Gắn accessToken vào header
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Tự động gọi refresh khi accessToken hết hạn
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // Những API không cần check
        if (
            originalRequest.url.includes("/auth/signin") ||
            originalRequest.url.includes("/auth/signup") ||
            originalRequest.url.includes("/auth/gettoken")
        ) {
            return Promise.reject(error);
        }

        // Giới hạn số lần thử refresh
        originalRequest._retryCount = originalRequest._retryCount || 0;

        if (error.response?.status === 403 && originalRequest._retryCount < 4) {
            originalRequest._retryCount += 1;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("Missing refresh token");
                }

                // 🧩 Gọi API lấy accessToken mới
                const res = await api.post(
                    `auth/gettoken`,
                    { refreshToken }
                );

                const newAccessToken = res.data.accessToken;

                // 🧩 Cập nhật store và gắn lại header
                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // 🧩 Gửi lại request cũ
                return api(originalRequest);
            } catch (refreshError) {
                // Nếu refresh fail → logout
                useAuthStore.getState().clearState();
                localStorage.removeItem("refreshToken");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
