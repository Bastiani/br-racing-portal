import AdminLayout from '@/components/pages/admin/AdminLayout';
import AuthProvider from '@/components/pages/AuthProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}