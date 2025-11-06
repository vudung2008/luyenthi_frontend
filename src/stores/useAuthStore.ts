import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/AuthState";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    setAccessToken: (accessToken) => {
        set({ accessToken });
    },
    clearState: () => {
        set({ accessToken: null, user: null, loading: false });
    },

    signUp: async (username, password, email, firstName, lastName, gender, birth) => {
        try {
            set({ loading: true });

            //  gọi api
            await authService.signUp(username, password, email, firstName, lastName, gender, birth);

            toast.success("Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.");
        } catch (error) {
            console.error(error);
            toast.error("Đăng ký không thành công");
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true });

            await authService.signIn(username, password);
            // gọi refresh() của store (tự set token + load user)
            await get().refresh();
            toast.success("Chào mừng bạn quay lại🎉");
        } catch (error) {
            console.error(error);
            toast.error("Đăng nhập không thành công!");
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success("Logout thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi xảy ra khi logout. Hãy thử lại!");
        }
    },

    getMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.getMe();

            set({ user });
        } catch (error) {
            console.error(error);
            set({ user: null, accessToken: null });
            toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
        } finally {
            set({ loading: false });
        }
    },

    refresh: async () => {
        try {
            set({ loading: true });
            const { user, getMe, setAccessToken } = get();
            const accessToken = await authService.refresh();

            setAccessToken(accessToken);

            if (!user) {
                await getMe();
            }
        } catch (error) {
            console.error(error);
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            get().clearState();
        } finally {
            set({ loading: false });
        }
    },
}));