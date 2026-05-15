import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListReports, useListClients } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Calendar } from "lucide-react";
import { formatDate } from "@/lib/format";

export default function Reports() {
  const [clientId, setClientId] = useState<string>("all");
  
  const { data: clients } = useListClients();
  const { data: reports, isLoading } = useListReports({ 
    clientId: clientId === "all" ? undefined : Number(clientId) 
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">QA Reports</h1>
            <p className="text-muted-foreground mt-1">Historical test execution data and summaries</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="w-[200px] bg-card">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {Array.isArray(clients) && clients.map(client => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" /> Last 30 Days
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-8 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !Array.isArray(reports) || reports.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No reports generated</h3>
              <p className="text-muted-foreground">Reports are automatically generated at the end of each billing cycle or month.</p>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {report.clientName} - {report.period} Summary
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Generated on {formatDate(report.createdAt)}
                    </CardDescription>
                  </div>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Download className="h-4 w-4" /> Export PDF
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Test Runs</p>
                      <p className="text-2xl font-bold">{report.totalRuns.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Avg Success Rate</p>
                      <p className="text-2xl font-bold text-emerald-600">{report.avgSuccessRate.toFixed(1)}%</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Critical Failures</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Resolution Time</p>
                      <p className="text-2xl font-bold">14m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
