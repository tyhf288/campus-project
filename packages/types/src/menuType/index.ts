type AdminRole = "admin" | "auditor";
interface MenuItem {
  path: string;
  name: string;
  component?: string;
  meta: {
    title: string;
    icon?: string;
    roles: AdminRole[];
  };
  children?: MenuItem[];
}
const a =1

export type { AdminRole, MenuItem };
