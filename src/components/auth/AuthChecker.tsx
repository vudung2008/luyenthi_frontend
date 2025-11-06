import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const AuthChecker = () => {
    const { accessToken, user, loading, refresh, getMe } = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        try {
            // Nếu chưa có token, thử refresh
            if (!accessToken) {
                await refresh();
            }

            // Nếu có token mà chưa có user info, gọi getMe
            if (accessToken && !user) {
                await getMe();
            }
        } catch (err) {
            console.log("Chưa đăng nhập");
        } finally {
            setStarting(false);
        }
    };

    useEffect(() => {
        init();
    }, []);

    if (starting || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                Đang kiểm tra đăng nhập...
            </div>
        );
    }

    // Nếu đã login → redirect về /
    if (accessToken && user) {
        return <Navigate to="/" replace />;
    }

    // Nếu chưa login → cho phép truy cập route con (ví dụ /signin, /signup)
    return <Outlet />;
};

export default AuthChecker;
