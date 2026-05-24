// assuredia/src/pages/dashboard.tsx
import { useUser } from '@/context/UserContext';
import AdminDashboard from './adminDashboard';
import ClientDashboard from './clientDashboard';

export default function Dashboard() {
  const { user } = useUser();
  if (user?.role === 'admin') return <AdminDashboard />;
  return <ClientDashboard />;
}