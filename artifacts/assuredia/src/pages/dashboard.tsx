import { useGetDashboardSummary, useGetExecutionTrend, useGetFailedByModule, useListTestRuns, useListAlerts } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle, Activity, ServerCrash, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration, formatDate } from "@/lib/format";

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: trendData, isLoading: loadingTrend } = useGetExecutionTrend({ days: 30 });
  const { data: failedByModule, isLoading: loadingFailed } = useGetFailedByModule();
  const { data: recentRuns, isLoading: loadingRuns } = useListTestRuns({ clientId: undefined, limit: 10 });
  const { data: recentAlerts, isLoading: loadingAlerts } = useListAlerts({ clientId: undefined, limit: 5 });

  const PIE_COLORS = ["#0B5ED7", "#14B8A6", "#3B82F6", "#8B5CF6", "#6366F1"];

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of your QA monitoring</p>
        </div>

        {/* Metric Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              {loadingSummary ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-3xl font-bold">{summary?.successRate.toFixed(1)}%</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Across all active tests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {loadingSummary ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-3xl font-bold">{summary?.totalTests.toLocaleString()}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Executed this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Failed Tests</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              {loadingSummary ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-3xl font-bold">{summary?.failedTests.toLocaleString()}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Runs</CardTitle>
              <Clock className="h-4 w-4 text-teal-500" />
            </CardHeader>
            <CardContent>
              {loadingSummary ? <Skeleton className="h-8 w-20" /> : (
                <div className="text-3xl font-bold">{summary?.activeRuns}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Currently executing</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Execution Trend (30 Days)</CardTitle>
              <CardDescription>Daily test execution outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {loadingTrend ? <Skeleton className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="passed" name="Passed" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="failed" name="Failed" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="skipped" name="Skipped" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Failures by Module</CardTitle>
              <CardDescription>Where test failures are concentrated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {loadingFailed ? <Skeleton className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={failedByModule || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="module"
                      >
                        {(failedByModule || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                        formatter={(value) => [`${value} failures`, undefined]}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables Row */}
        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>Recent Test Runs</CardTitle>
              <CardDescription>Latest execution jobs across all clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-md">Client</th>
                      <th className="px-4 py-3 font-medium">Flow</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Passed</th>
                      <th className="px-4 py-3 font-medium text-right">Failed</th>
                      <th className="px-4 py-3 font-medium">Duration</th>
                      <th className="px-4 py-3 font-medium rounded-tr-md">Started</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loadingRuns ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-8 ml-auto" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-8 ml-auto" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                          <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                        </tr>
                      ))
                    ) : recentRuns?.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                          No recent runs found.
                        </td>
                      </tr>
                    ) : (
                      recentRuns?.map((run) => (
                        <tr key={run.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{run.clientName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{run.flow}</td>
                          <td className="px-4 py-3">
                            <Badge variant={
                              run.status === 'passed' ? 'default' : 
                              run.status === 'failed' ? 'destructive' : 
                              run.status === 'running' ? 'secondary' : 'outline'
                            } className={
                              run.status === 'passed' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20' : ''
                            }>
                              {run.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-600 font-medium">{run.passed}</td>
                          <td className="px-4 py-3 text-right text-destructive font-medium">{run.failed}</td>
                          <td className="px-4 py-3 text-muted-foreground">{formatDuration(run.duration)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{formatDate(run.startedAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Unresolved issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingAlerts ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))
                ) : recentAlerts?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground flex flex-col items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500/50 mb-3" />
                    <p>No active alerts!</p>
                  </div>
                ) : (
                  recentAlerts?.map((alert) => (
                    <div key={alert.id} className="flex gap-3 group">
                      <div className={`mt-0.5 flex-shrink-0 rounded-full p-1.5 ${
                        alert.severity === 'critical' ? 'bg-destructive/10 text-destructive' :
                        alert.severity === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {alert.severity === 'critical' ? <ServerCrash className="h-4 w-4" /> :
                         alert.severity === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                         <Activity className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none text-foreground mb-1">{alert.clientName}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{formatDate(alert.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
