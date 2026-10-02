import { requireAdmin } from "@/lib/auth";
import { AppSidebar } from "./_components/app-sidebar";
import styles from "./dashboard.module.css";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();

  return (
    <div className={styles.shell}>
      <AppSidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
