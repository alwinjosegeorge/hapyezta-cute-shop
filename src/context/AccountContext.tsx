import React, { createContext, useContext, useState, useEffect } from "react";

interface AccountContextType {
  isAccountOpen: boolean;
  openAccount: () => void;
  closeAccount: () => void;
  setIsAccountOpen: (open: boolean) => void;
  
  profileName: string;
  profileEmoji: string;
  profileEmail: string;
  profilePhone: string;
  
  saveProfile: (name: string, emoji: string, email: string, phone: string) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [profileName, setProfileName] = useState("Ananya Sharma");
  const [profileEmoji, setProfileEmoji] = useState("🌸");
  const [profileEmail, setProfileEmail] = useState("ananya@kawaii.com");
  const [profilePhone, setProfilePhone] = useState("+91 98765 43210");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hapyezta-profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setProfileName(parsed.name);
        if (parsed.emoji) setProfileEmoji(parsed.emoji);
        if (parsed.email) setProfileEmail(parsed.email);
        if (parsed.phone) setProfilePhone(parsed.phone);
      }
    } catch (error) {
      console.error("Failed to load profile settings:", error);
    }
  }, []);

  const openAccount = () => setIsAccountOpen(true);
  const closeAccount = () => setIsAccountOpen(false);

  const saveProfile = (name: string, emoji: string, email: string, phone: string) => {
    setProfileName(name);
    setProfileEmoji(emoji);
    setProfileEmail(email);
    setProfilePhone(phone);
    try {
      localStorage.setItem(
        "hapyezta-profile",
        JSON.stringify({ name, emoji, email, phone })
      );
    } catch (error) {
      console.error("Failed to save profile settings:", error);
    }
  };

  return (
    <AccountContext.Provider
      value={{
        isAccountOpen,
        openAccount,
        closeAccount,
        setIsAccountOpen,
        profileName,
        profileEmoji,
        profileEmail,
        profilePhone,
        saveProfile,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
