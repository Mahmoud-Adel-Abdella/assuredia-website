import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, Bell, Shield, Key, Webhook } from "lucide-react";
import { useListClients, useUpdateClient } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function Settings() {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<string>("");
  const { data: clients, isLoading } = useListClients();
  const updateClient = useUpdateClient();
  const queryClient = useQueryClient();
  
  const [webhookUrl, setWebhookUrl] = useState("");

  const handleClientChange = (val: string) => {
    setSelectedClient(val);
    const client = clients?.find(c => c.id.toString() === val);
    if (client) {
      setWebhookUrl(client.webhookUrl || "");
    }
  };

  const handleSaveWebhook = () => {
    if (!selectedClient) return;
    
    updateClient.mutate({
      id: Number(selectedClient),
      data: { webhookUrl }
    }, {
      onSuccess: () => {
        toast({ title: "Settings saved", description: "Webhook URL updated successfully." });
        queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to update settings." });
      }
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage platform configuration and client preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-1 space-y-1">
            <nav className="flex flex-col space-y-1">
              <Button variant="secondary" className="justify-start gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <Webhook className="h-4 w-4" /> Webhooks
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <Key className="h-4 w-4" /> API Keys
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <Shield className="h-4 w-4" /> Security
              </Button>
            </nav>
          </div>

          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Notifications</CardTitle>
                <CardDescription>Configure how you want to be alerted when issues occur.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Critical Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify immediately when tests fail on production.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Warning Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify when performance degrades or tests are flaky.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of QA metrics.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Webhooks</CardTitle>
                <CardDescription>Send test execution results directly to your team's chat or CI/CD pipelines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label>Select Client</Label>
                  {isLoading ? <Skeleton className="h-10 w-full" /> : (
                    <Select value={selectedClient} onValueChange={handleClientChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a client environment" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients?.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name} ({c.environment})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {selectedClient && (
                  <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label>Webhook URL</Label>
                    <Input 
                      placeholder="https://hooks.slack.com/services/..." 
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">JSON payloads will be POSTed to this URL on test completion.</p>
                    
                    <div className="pt-2 flex justify-end">
                      <Button onClick={handleSaveWebhook} disabled={updateClient.isPending} className="gap-2">
                        <Save className="h-4 w-4" /> 
                        {updateClient.isPending ? "Saving..." : "Save Webhook"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
