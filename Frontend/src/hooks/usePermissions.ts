import { useMemo } from "react";

export type Module = "CATEGORIES" | "PRODUCTS" | "ORDERS" | "STOCKS" | "COUPONS" | "REVIEWS";
export type Action = "CREATE" | "READ" | "UPDATE" | "DELETE";

export const usePermissions = () => {
  const roles: string[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("roles") || "[]");
    } catch {
      return [];
    }
  }, []);

  const permissions: Record<string, string[]> = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "{}");
    } catch {
      return {};
    }
  }, []);

  const hasPermission = (module: Module, action: Action): boolean => {
    // Main Admin has all permissions
    if (roles.includes("ADMIN")) return true;

    // Sub-Admin permissions check
    if (roles.includes("SUB_ADMIN")) {
      const modulePerms = permissions[module];
      return modulePerms ? modulePerms.includes(action) : false;
    }

    // Regular users or non-admins have no permissions for management
    return false;
  };

  const isAdmin = roles.includes("ADMIN");
  const isSubAdmin = roles.includes("SUB_ADMIN");

  return { hasPermission, isAdmin, isSubAdmin };
};
