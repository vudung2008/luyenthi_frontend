import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { Spinner } from "../ui/spinner";

const ProtectedRoute = () => {
    const { accessToken, user, classes, loading, refresh, getMe, getClass } = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        try {

            // có thể xảy ra khi refresh trang
            if (!accessToken && localStorage.getItem('refreshToken')) {
                await refresh();
                await getClass();
            }

            if (accessToken && !user) {
                await getMe();
            }

            if (accessToken && !classes) {
                await getClass();
            }

        } catch (error) {
            console.error(error);
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
                <Spinner />
                Đang tải trang...
            </div>
        );
    }

    if (!accessToken) {
        return (
            <Navigate
                to="/signin"
                replace
            />
        );
    }

    return <Outlet></Outlet>;
};

export default ProtectedRoute;