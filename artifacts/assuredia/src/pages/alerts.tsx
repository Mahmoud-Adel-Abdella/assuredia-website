import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListAlerts, useListClients } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServerCrash, AlertTriangle, Activity, CheckCircle2, Filter, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useQueryClient } from "@tanstack/react-query";

const SEVERITY_CONFIG = {
  critical: {
    icon: ServerCrash,
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
    bg: "bg-destructive/5",
  },
  warning: {
    icon: AlertTriangle,
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    dot: "bg-amber-500",
    bg: "bg-amber-500/5",
  },
  info: {
    icon: Activity,
    badge: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    dot: "bg-blue-500",
    bg: "bg-blue-500/5",
  },
};

export default function Alerts() {
  const [clientId, setClientId] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");
  const queryClient = useQueryClient();
  const { data: clients } = useListClients();
  const { data: alerts, isLoading, isFetching } = useListAlerts({
    clientId: clientId === "all" ? undefined : Number(clientId),
    limit: 50,
  });

  const filtered = alerts?.filter((a) =>
    severity === "all" ? true : a.severity === severity
  );

  const counts = {
    critical: alerts?.filter((a) => a.severity === "critical").length ?? 0,
    warning: alerts?.filter((a) => a.severity === "warning").length ?? 0,
    info: alerts?.filter((a) => a.severity === "info").length ?? 0,
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
            <p className="text-muted-foreground mt-1">Active issues and notifications across all clients</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/alerts"] })}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-3">
          <Card
            className={`cursor-pointer border-2 transition-all ${severity === "critical" ? "border-destructive" : "border-transparent hover:border-destructive/30"}`}
            onClick={() => setSeverity(severity === "critical" ? "all" : "critical")}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-2.5 bg-destructive/10">
                <ServerCrash className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold">{isLoading ? "—" : counts.critical}</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer border-2 transition-all ${severity === "warning" ? "border-amber-500" : "border-transparent hover:border-amber-500/30"}`}
            onClick={() => setSeverity(severity === "warning" ? "all" : "warning")}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-2.5 bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warning</p>
                <p className="text-2xl font-bold">{isLoading ? "—" : counts.warning}</p>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer border-2 transition-all ${severity === "info" ? "border-blue-500" : "border-transparent hover:border-blue-500/30"}`}
            onClick={() => setSeverity(severity === "info" ? "all" : "info")}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-2.5 bg-blue-500/10">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Info</p>
                <p className="text-2xl font-bold">{isLoading ? "—" : counts.info}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger className="w-[200px] bg-card">
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients?.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          {(clientId !== "all" || severity !== "all") && (
            <Button variant="ghost" size="sm" onClick={() => { setClientId("all"); setSeverity("all"); }}>
              Clear filters
            </Button>
          )}
        </div>

        {/* Alert List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>
              {isLoading ? "Loading..." : `${filtered?.length ?? 0} alert${(filtered?.length ?? 0) !== 1 ? "s" : ""} found`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="divide-y divide-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-start gap-4">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-full max-w-sm" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : filtered?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500/50 mb-4" />
                <h3 className="text-lg font-medium">All clear!</h3>
                <p className="text-muted-foreground mt-1">No alerts matching your filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered?.map((alert) => {
                  const config = SEVERITY_CONFIG[alert.severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.info;
                  const Icon = config.icon;
                  const statusLabel = alert.resolved ? "resolved" : "open";
                  return (
                    <div
                      key={alert.id}
                      className={`px-6 py-4 flex items-start gap-4 hover:bg-muted/20 transition-colors ${statusLabel === "open" ? config.bg : ""}`}
                    >
                      <div className={`mt-0.5 flex-shrink-0 rounded-full p-2 ${config.badge}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-foreground">{alert.clientName}</span>
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{alert.message}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1.5">{formatDate(alert.createdAt)}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`flex-shrink-0 capitalize text-xs ${
                          statusLabel === "open"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        }`}
                      >
                        {statusLabel}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
