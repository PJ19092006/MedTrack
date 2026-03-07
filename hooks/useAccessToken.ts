import { useState, useEffect } from "react";

export function useAccessToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOrCreateToken = async () => {
      try {
        setIsLoading(true);

        // Check if token exists in localStorage
        const storedToken = localStorage.getItem("med_access_token");

        if (storedToken) {
          setToken(storedToken);
          setIsLoading(false);
          return;
        }

        // Verify user is authenticated by checking /api/auth/patient/me
        const meRes = await fetch("/api/auth/patient/me");
        if (!meRes.ok) {
          // User not authenticated, don't generate token
          setIsLoading(false);
          return;
        }

        // Token doesn't exist but user is authenticated, generate new one
        const res = await fetch("/api/access/generate", {
          method: "POST",
        });

        const data = await res.json();

        if (data.success && data.data?.token) {
          localStorage.setItem("med_access_token", data.data.token);
          setToken(data.data.token);
        }
      } catch (error) {
        console.error("Error managing access token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Run on mount
    checkOrCreateToken();

    // Also listen for storage changes (multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "med_access_token") {
        setToken(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const clearToken = () => {
    localStorage.removeItem("med_access_token");
    setToken(null);
  };

  return { token, isLoading, clearToken };
}
