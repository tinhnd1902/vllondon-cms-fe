"use client";
import { useEffect, useState } from "react";
import Loading from "../ui/loading/Loading";
import useAppRouter from "@/hooks/useAppRouter";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isTokenExpired, goToLogin} = useAppRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (isTokenExpired()) {
            goToLogin();
        } else {
            setChecking(false);
        }
    }, [goToLogin]);
    if (checking) return <Loading />;
    return <>{children}</>;
}