import { createContext, useContext, useMemo, useState } from "react";

const APP_SESSION_KEY = "nb_app_session";

const DEFAULT_ADMIN_EMAILS = ["admin@neurobridge.app"];
const DEFAULT_USER_EMAILS = ["user@neurobridge.app"];

const ROLE_PERMISSIONS = {
  user: [
    "view_dashboard",
    "use_support_tools",
  ],
  admin: [
    "view_dashboard",
    "use_support_tools",
    "manage_schedule",
    "manage_settings",
    "manage_ai",
    "manage_content",
  ],
};

const RoleContext = createContext(null);

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const parseEmailList = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback.map(normalizeEmail);

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback.map(normalizeEmail);
    return parsed.map(normalizeEmail).filter(Boolean);
  } catch {
    return fallback.map(normalizeEmail);
  }
};

const getRoleForEmail = (email, adminEmails, userEmails) => {
  if (adminEmails.includes(email)) return "admin";
  if (userEmails.includes(email)) return "user";
  return null;
};

export function RoleProvider({ children }) {
  const adminEmails = parseEmailList("nb_authorized_admin_emails", DEFAULT_ADMIN_EMAILS);
  const userEmails = parseEmailList("nb_authorized_user_emails", DEFAULT_USER_EMAILS);

  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(APP_SESSION_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      const normalizedEmail = normalizeEmail(parsed?.email || "");
      const role = getRoleForEmail(normalizedEmail, adminEmails, userEmails);
      return role ? { email: normalizedEmail, role } : null;
    } catch {
      return null;
    }
  });

  const signInWithEmail = (email) => {
    const normalizedEmail = normalizeEmail(email);
    const role = getRoleForEmail(normalizedEmail, adminEmails, userEmails);

    if (!role) {
      return {
        ok: false,
        message: "This email is not authorized. Contact admin to get access.",
      };
    }

    const nextSession = { email: normalizedEmail, role };
    setSession(nextSession);
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(nextSession));
    return { ok: true, role };
  };

  const signOut = () => {
    setSession(null);
    localStorage.removeItem(APP_SESSION_KEY);
  };

  const role = session?.role || "user";
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.user;

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session),
      currentEmail: session?.email || "",
      role,
      signInWithEmail,
      signOut,
      permissions,
      isAdmin: role === "admin",
      hasPermission: (permission) => permissions.includes(permission),
      authorizedEmails: {
        admin: adminEmails,
        user: userEmails,
      },
    }),
    [session, role, permissions, adminEmails, userEmails],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used inside RoleProvider");
  }
  return context;
}

export function usePermission(permission) {
  const { hasPermission } = useRole();
  return hasPermission(permission);
}
