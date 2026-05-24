// assuredia/src/pages/AdminDashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  // بيانات وهمية (mock data)
  const totalClients = 5;
  const avgSuccessRate = 97.5;
  const activeAlerts = 3;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Total Clients</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{totalClients}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Avg. Success Rate</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{avgSuccessRate}%</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Alerts</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{activeAlerts}</p></CardContent>
        </Card>
      </div>
      <p className="text-muted-foreground">(Dashboard endpoints قيد التطوير – بيانات تجريبية)</p>
    </div>
  );
}