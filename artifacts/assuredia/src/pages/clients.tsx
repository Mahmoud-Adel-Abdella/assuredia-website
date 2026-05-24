import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListClients, useCreateTestRun, useCreateClient } from "@workspace/api-client-react";
import { formatDate } from "@/lib/format";
import { Search, Plus, Play, ExternalLink, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: clients, isLoading } = useListClients();
  
  const filteredClients = Array.isArray(clients)
    ? clients.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.environment?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monitored Clients</h1>
            <p className="text-muted-foreground mt-1">Manage test environments and trigger runs</p>
          </div>
          <AddClientModal />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search clients..." 
              className="pl-9 bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Client Name</th>
                    <th className="px-6 py-4 font-medium">Environment</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Success Rate</th>
                    <th className="px-6 py-4 font-medium">Last Run</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-12 ml-auto" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No clients found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">
                          {client.name}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{client.environment}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={client.status} />
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {client.successRate.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{formatDate(client.lastRunAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <TriggerRunModal clientId={client.id} clientName={client.name} />
                            <Button variant="ghost" size="icon" title="View Details">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getVariant = () => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "warning": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "error": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400";
    }
  };
  return <Badge variant="outline" className={`capitalize ${getVariant()}`}>{status}</Badge>;
}

function TriggerRunModal({ clientId, clientName }: { clientId: number, clientName: string }) {
  const [open, setOpen] = useState(false);
  const [flow, setFlow] = useState("all");
  const createTestRun = useCreateTestRun();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleTrigger = () => {
    createTestRun.mutate(
      { data: { clientId, flow } },
      {
        onSuccess: () => {
          toast({
            title: "Test Run Triggered",
            description: `Successfully initiated test run for ${clientName}`,
          });
          queryClient.invalidateQueries({ queryKey: ["/api/test-runs"] });
          queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
          setOpen(false);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to trigger",
            description: "An error occurred while starting the test run.",
          });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Play className="h-3.5 w-3.5" /> Trigger
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trigger Test Run</DialogTitle>
          <DialogDescription>
            Initiate a manual test execution for {clientName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="flow">Execution Flow</Label>
            <Select value={flow} onValueChange={setFlow}>
              <SelectTrigger>
                <SelectValue placeholder="Select flow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suites (Full Regression)</SelectItem>
                <SelectItem value="smoke">Smoke Tests</SelectItem>
                <SelectItem value="critical">Critical Paths</SelectItem>
                <SelectItem value="auth">Authentication Flow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleTrigger} disabled={createTestRun.isPending}>
            {createTestRun.isPending ? "Starting..." : "Start Run"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddClientModal() {
  const [open, setOpen] = useState(false);
  
  // Basic Info
  const [clientName, setClientName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Notification & Scheduling
  const [notifyPolicy, setNotifyPolicy] = useState("on-failure");
  const [scheduleInterval, setScheduleInterval] = useState("15-minutes");
  const [scheduleActive, setScheduleActive] = useState(true);
  const [browser, setBrowser] = useState("chrome");
  
  const createClient = useCreateClient();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getCronExpression = (interval: string): string => {
    switch (interval) {
      case "5-minutes": return "*/5 * * * *";
      case "15-minutes": return "*/15 * * * *";
      case "1-hour": return "0 * * * *";
      case "6-hours": return "0 */6 * * *";
      case "daily-3am": return "0 3 * * *";
      default: return "*/15 * * * *";
    }
  };

  const handleCreate = () => {
    if (!clientName || !baseUrl) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in Client Name and Base URL",
      });
      return;
    }

    const clientData = {
      name: clientName,
      environment: "production",
      baseUrl: baseUrl,
      username: username || null,
      password: password || null,
      notifyPolicy: notifyPolicy,
      browser: browser,
      headless: true,
      aiActive: false,
      schedule: {
        cronExpression: getCronExpression(scheduleInterval),
        isActive: scheduleActive
      }
    };

    createClient.mutate(
      { data: clientData },
      {
        onSuccess: () => {
          toast({ 
            title: "✓ Client Added", 
            description: `${clientName} is now being monitored.` 
          });
          queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
          queryClient.invalidateQueries({ queryKey: ["/api/flows"] });
          setOpen(false);
          setClientName("");
          setBaseUrl("");
          setUsername("");
          setPassword("");
          setNotifyPolicy("on-failure");
          setScheduleInterval("15-minutes");
          setScheduleActive(true);
          setBrowser("chrome");
        },
        onError: (error: any) => {
          toast({ 
            variant: "destructive", 
            title: "Error", 
            description: error?.message || "Could not add client. Please try again." 
          });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-4 w-4" /> Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Configure a new client for continuous QA monitoring
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm font-medium">
              Client Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Acme Corporation"
              autoFocus
            />
          </div>

          {/* Base URL */}
          <div className="space-y-2">
            <Label htmlFor="baseUrl" className="text-sm font-medium">
              Base URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="baseUrl"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://acme.com"
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              The main URL of your application (including http:// or https://)
            </p>
          </div>

          {/* Username & Password */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@acme.com"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                For authenticated flows (stored securely)
              </p>
            </div>
          </div>

          {/* Notify Policy */}
          <div className="space-y-2">
            <Label htmlFor="notifyPolicy" className="text-sm font-medium">
              Notify Policy
            </Label>
            <Select value={notifyPolicy} onValueChange={setNotifyPolicy}>
              <SelectTrigger id="notifyPolicy">
                <SelectValue placeholder="Select notification policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always - Notify on every run</SelectItem>
                <SelectItem value="on-failure">On Failure - Only when tests fail</SelectItem>
                <SelectItem value="never">Never - Disable notifications</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              When should we send Telegram alerts?
            </p>
          </div>

          {/* Scheduling */}
          <div className="space-y-2">
            <Label htmlFor="schedule" className="text-sm font-medium">
              Scheduling
            </Label>
            <Select value={scheduleInterval} onValueChange={setScheduleInterval}>
              <SelectTrigger id="schedule">
                <SelectValue placeholder="Select schedule interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5-minutes">Every 5 minutes</SelectItem>
                <SelectItem value="15-minutes">Every 15 minutes</SelectItem>
                <SelectItem value="1-hour">Every hour</SelectItem>
                <SelectItem value="6-hours">Every 6 hours</SelectItem>
                <SelectItem value="daily-3am">Daily at 3:00 AM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduling Active */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Scheduling Active</Label>
              <p className="text-xs text-muted-foreground">
                Enable automatic test execution
              </p>
            </div>
            <Switch
              checked={scheduleActive}
              onCheckedChange={setScheduleActive}
            />
          </div>

          {/* Browser */}
          <div className="space-y-2">
            <Label htmlFor="browser" className="text-sm font-medium">
              Browser
            </Label>
            <Select value={browser} onValueChange={setBrowser}>
              <SelectTrigger id="browser">
                <SelectValue placeholder="Select browser" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chrome">Chrome (Recommended)</SelectItem>
                <SelectItem value="firefox">Firefox</SelectItem>
                <SelectItem value="edge">Microsoft Edge</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={createClient.isPending || !clientName || !baseUrl}
            className="bg-primary hover:bg-primary/90"
          >
            {createClient.isPending ? (
              <>Adding Client...</>
            ) : (
              <>Add Client</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}