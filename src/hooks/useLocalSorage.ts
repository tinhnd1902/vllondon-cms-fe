class LocalStorageManager {
    static set<T>(key: string, value: T): void {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, JSON.stringify(value));
    }

    static get<T>(key: string): T | null {
        if (typeof window === "undefined") return null;
        const item = localStorage.getItem(key);
        if (!item) return null;
        try {
            return JSON.parse(item) as T;
        } catch {
            return null;
        }
    }

    static remove(key: string): void {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    }

    static clear(): void {
        if (typeof window === "undefined") return;
        localStorage.clear();
    }
}

export default LocalStorageManager;