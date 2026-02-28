import { createContext, useContext, useMemo, useState } from "react";

const APP_ROLE_KEY = "nb_app_role";

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

export function RoleProvider({ children }) {
  const [role, setRoleState] = useState(() => {
    const stored = localStorage.getItem(APP_ROLE_KEY);
    return stored === "admin" ? "admin" : "user";
  });

  const setRole = (nextRole) => {
    const normalizedRole = nextRole === "admin" ? "admin" : "user";
    setRoleState(normalizedRole);
    localStorage.setItem(APP_ROLE_KEY, normalizedRole);
  };

  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.user;

  const value = useMemo(
    () => ({
      role,
      setRole,
      permissions,
      isAdmin: role === "admin",
      hasPermission: (permission) => permissions.includes(permission),
    }),
    [role, permissions],
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
