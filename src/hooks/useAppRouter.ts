import { useRouter } from "next/navigation";
import { useEffect } from "react";



interface Router {
    title: string;
    path: string;
}

export const appRouter: Record<string, Router> = {
    // Page không cần quyền truy cập
    login: {
        title: "Login",
        path: "/login"
    },
    // Page cần quyền truy cập
    home: {
        title: "Home",
        path: "/home"
    },
    domain: {
        title: "Domain",
        path: "/domain"
    },
    source: {
        title: "Source",
        path: "/source"
    }
}

export const useAppRouter = () => {
    const router = useRouter();

    useEffect(() => {
        if (isTokenExpired()) {
            localStorage.removeItem("access_token");
            pushTo(appRouter.login);
        }
    }, [router]);

    const isTokenExpired = (): boolean => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    };

    const pushTo = (page: Router) => {
        router.push(page.path);
    }

    // Hàm logout
    const logout = () => {
        localStorage.removeItem("access_token");
        pushTo(appRouter.login);
    };

    return {
        isTokenExpired,
        goBack: () => {
            if (window.history.length > 1) {
                router.back();
            } else {
                pushTo(appRouter.home);;
            }
        },
        goToLogin: () => pushTo(appRouter.login),
        goToDashboard: () => router.replace(appRouter.home.path),
        pushTo,
        logout,
    };
};

export default useAppRouter;