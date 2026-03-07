import { useState, useEffect } from "react";

export interface UserData {
  _id: string;
  phin: string;
  name: string;
  dob: string | Date;
  conditions?: string[];
  vaccines?: any[];
  medicalHistory?: any[];
}

export function useAuthenticatedUser() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/auth/patient/me");
        const data = await res.json();

        if (data.success) {
          setUser(data.data);
          setError(null);
        } else {
          setError(data.message || "Failed to load user data");
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Error loading user data");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading, error };
}
