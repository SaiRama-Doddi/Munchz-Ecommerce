import { createContext, useContext, useEffect, useState } from "react";

interface Profile {
  firstName: string;
  lastName: string;
  id: string;
/*   userId: string;  */
  mobile: string;
  email?: string;
}

interface AuthContextType {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  updateProfile: (profile: Profile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  // 🔹 Load profile from localStorage on refresh
  useEffect(() => {
    const storedProfile = localStorage.getItem("profile");

    if (storedProfile && storedProfile !== "undefined") {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (err) {
        console.error("Profile parse failed", err);
        localStorage.removeItem("profile");
      }
    }
  }, []);

  // 🔹 Update profile everywhere (UI + storage)
  const updateProfile = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    localStorage.setItem("profile", JSON.stringify(updatedProfile));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setProfile(null);
    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
