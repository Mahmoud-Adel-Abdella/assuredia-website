import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListClients, useCreateTestRun, useCreateClient } from "@workspace/api-client-react";
import { formatDate } from "@/lib/format";
import { Search, Plus, Play, ExternalLink } from "lucide-react";
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
  
  const filteredClients = clients?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.environment.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  ) : filteredClients?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        No clients found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredClients?.map((client) => (
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
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState("production");
  const createClient = useCreateClient();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCreate = () => {
    createClient.mutate(
      { data: { name, environment } },
      {
        onSuccess: () => {
          toast({ title: "Client Added", description: `Successfully added ${name}` });
          queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
          setOpen(false);
          setName("");
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Could not add client." });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Monitored Client</DialogTitle>
          <DialogDescription>
            Register a new client environment for QA monitoring.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Client Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Corp" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="env">Environment</Label>
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger>
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={createClient.isPending || !name}>
            {createClient.isPending ? "Adding..." : "Add Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
