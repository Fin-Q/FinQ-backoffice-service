import { requireAdmin } from "@/lib/auth";
import { AppHeader } from "./_components/app-header";
import styles from "./dashboard.module.css";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();

  return (
    <div className={styles.shell}>
      <AppHeader />
      {children}
    </div>
  );
}
