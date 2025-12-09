export function safeStorageAvailable(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
        return false;
    }

    try {
        const testKey = '__storage_test__';
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

export function safeGetItem(key: string): string | null {
    if (!safeStorageAvailable()) {
        return null;
    }

    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function safeSetItem(key: string, value: string): void {
    if (!safeStorageAvailable()) {
        return;
    }

    try {
        window.localStorage.setItem(key, value);
    } catch {
        // ignore
    }
}

export function safeRemoveItem(key: string): void {
    if (!safeStorageAvailable()) {
        return;
    }

    try {
        window.localStorage.removeItem(key);
    } catch {
        // ignore
    }
}

