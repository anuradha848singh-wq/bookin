// Role-Based Access Control Utility
export type Role = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
export type Action = "manage_billing" | "manage_team" | "manage_settings" | "edit_content" | "publish" | "view";

const roleHierarchy: Record<Role, Action[]> = {
  OWNER: ["manage_billing", "manage_team", "manage_settings", "edit_content", "publish", "view"],
  ADMIN: ["manage_team", "manage_settings", "edit_content", "publish", "view"],
  EDITOR: ["edit_content", "view"],
  VIEWER: ["view"],
};

export function can(userRole: string, action: Action): boolean {
  if (!userRole) return false;
  
  // Normalize role
  const role = userRole.toUpperCase() as Role;
  const allowedActions = roleHierarchy[role];
  
  if (!allowedActions) return false;
  
  return allowedActions.includes(action);
}
