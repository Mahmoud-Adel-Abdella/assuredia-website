// assuredia/src/pages/ClientDashboard.tsx
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientDashboard() {
  const { user } = useUser();

  // بيانات وهمية خاصة بالعميل
  const clientName = user?.clientId === 1 ? 'Acme Inc.' : 'Your Company';
  const lastRunStatus = '✅ Passed';
  const successRate = 98;
  const lastRunDate = new Date().toLocaleString();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {clientName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Last Test Run</CardTitle></CardHeader>
          <CardContent>
            <p>Status: {lastRunStatus}</p>
            <p>Success Rate: {successRate}%</p>
            <p>Date: {lastRunDate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Your Site</CardTitle></CardHeader>
          <CardContent>
            <p>Base URL: https://example.com</p>
            <p>Browser: Chrome</p>
            <p>Notifications: On Failure</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-muted-foreground">(بيانات تجريبية – سيتم ربطها بالخادم لاحقاً)</p>
    </div>
  );
}