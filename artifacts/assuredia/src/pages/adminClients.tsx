import { useState } from "react";
import {
  Activity,
  Bell,
  Globe,
  Pencil,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import {
  useListClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
  useCreateTestRun,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

// استخدم النوع المُصدَّر من API client بدلاً من تعريف نوع يدوي
import type { Client as ApiClient } from "@workspace/api-client-react";

// تعريف نوع موسع يتوافق مع ما نحتاجه في الواجهة
// تعريف النوع الموسع ليشمل الحقول التي نستخدمها في الواجهة
interface ExtendedClient {
  id: number;
  name: string;
  baseUrl: string;
  browser: string;
  notifyPolicy: string;
  successRate: number;
  lastRunAt: string | null;
  status: "active" | "inactive" | "warning" | "error";
}

export default function AdminClients() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddClient, setShowAddClient] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRunTests, setShowRunTests] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ExtendedClient | null>(null);
  const [editForm, setEditForm] = useState({ name: "", baseUrl: "", browser: "chrome", notifyPolicy: "on-failure" });

  // API hooks
  const { data: clients = [], isLoading } = useListClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const createTestRun = useCreateTestRun();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
  };

  // تحويل بيانات API إلى النوع الموسع (باستخدام قيم افتراضية)
// تحويل بيانات API إلى النوع الموسع (باستخدام قيم افتراضية)
const extendedClients: ExtendedClient[] = (clients as any[]).map((c) => ({
  id: c.id,
  name: c.name || c.clientName,
  baseUrl: c.baseUrl || c.base_url || '',
  browser: c.browser || 'chrome',
  notifyPolicy: c.notifyPolicy || 'on-failure',
  successRate: c.successRate ?? 100,
  lastRunAt: c.lastRunAt ?? null,
  status: c.status ?? 'active',
}));

  // Filter clients
  const filteredClients = extendedClients.filter((c) => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ?? false;
    const matchStatus = statusFilter === "All" ? true : c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const totalClients = extendedClients.length;
  const avgSuccessRate = totalClients
    ? (extendedClients.reduce((sum, c) => sum + (c.successRate || 0), 0) / totalClients).toFixed(1)
    : 0;
  const activeAlerts = extendedClients.filter((c) => c.status === "error").length;

  const stats = [
    { title: "Total Clients", value: totalClients, icon: Globe },
    { title: "Avg Success Rate", value: `${avgSuccessRate}%`, icon: ShieldCheck },
    { title: "Active Alerts", value: activeAlerts, icon: Bell },
    { title: "Runs Today", value: "3,482", icon: Activity },
  ];

  // Handlers
  const handleAddClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      environment: formData.get("environment") as string || "production", // API يتوقع environment
      baseUrl: formData.get("baseUrl") as string,
      browser: formData.get("browser") as string,
      notifyPolicy: formData.get("notifyPolicy") as string,
    };
    try {
      await createClient.mutateAsync({ data });
      toast.success("Client added successfully");
      setShowAddClient(false);
      invalidate();
    } catch (err) {
      toast.error("Failed to add client");
      console.error(err);
    }
  };

  const handleEditClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClient) return;
    try {
      await updateClient.mutateAsync({ id: selectedClient.id, data: editForm });
      toast.success("Client updated");
      setShowEditClient(false);
      invalidate();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      await deleteClient.mutateAsync({ id: selectedClient.id });
      toast.success("Client deleted");
      setShowDeleteDialog(false);
      invalidate();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleRunTests = async () => {
    if (!selectedClient) {
      toast.error("Select a client");
      return;
    }
    // افتراضياً نستخدم flow = "all" (string) كما يتوقع الـ API
    try {
      await createTestRun.mutateAsync({ data: { clientId: selectedClient.id, flow: "all" } });
      toast.success("Tests started");
      setShowRunTests(false);
      invalidate();
    } catch (err) {
      toast.error("Failed to start tests");
    }
  };

  if (user?.role !== "admin") return <div className="text-white p-10">Unauthorized</div>;

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <main className="p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black">Monitored Clients</h2>
            <p className="text-slate-400">Monitor, manage, and automate QA workflows</p>
          </div>
          <button
            onClick={() => setShowAddClient(true)}
            className="bg-gradient-to-r from-blue-600 to-teal-500 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Client
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="border border-white/10 bg-white/[0.04] rounded-3xl p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.title}</p>
                    <h3 className="text-4xl font-bold">{stat.value}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/20 to-teal-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-teal-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 outline-none"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Clients Table */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-white/[0.03] text-slate-400 text-sm">
              <tr>
                <th className="text-left p-5">Client Name</th>
                <th className="text-left p-5">Base URL</th>
                <th className="text-left p-5">Status</th>
                <th className="text-left p-5">Success Rate</th>
                <th className="text-left p-5">Last Run</th>
                <th className="text-right p-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="p-5 font-semibold">{client.name}</td>
                  <td className="p-5 text-blue-400">{client.baseUrl}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      client.status === "active" ? "bg-emerald-500/10 text-emerald-400" : 
                      client.status === "inactive" ? "bg-slate-500/10 text-slate-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        client.status === "active" ? "bg-emerald-400" : 
                        client.status === "inactive" ? "bg-slate-400" : "bg-red-400"
                      }`} />
                      {client.status === "active" ? "Active" : client.status === "inactive" ? "Inactive" : "Error"}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`font-bold ${
                      (client.successRate || 0) > 80 ? "text-emerald-400" : (client.successRate || 0) > 50 ? "text-yellow-400" : "text-red-400"
                    }`}>{client.successRate || 0}%</span>
                  </td>
                  <td className="p-5 text-slate-400">{client.lastRunAt ? new Date(client.lastRunAt).toLocaleString() : "Never"}</td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setSelectedClient(client); setShowRunTests(true); }} className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20"><Play className="w-4 h-4 text-blue-400" /></button>
                      <button onClick={() => { setSelectedClient(client); setEditForm({ name: client.name, baseUrl: client.baseUrl || "", browser: client.browser || "chrome", notifyPolicy: client.notifyPolicy || "on-failure" }); setShowEditClient(true); }} className="p-2 rounded-xl bg-white/5 border border-white/10"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => { setSelectedClient(client); setShowDeleteDialog(true); }} className="p-2 rounded-xl bg-red-500/10 border border-red-500/20"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400">No clients found</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0b1120] rounded-3xl p-8 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add Client</h3>
              <button onClick={() => setShowAddClient(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-4">
              <input name="name" placeholder="Client Name" required className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
              <input name="environment" placeholder="Environment (e.g., production)" defaultValue="production" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
              <input name="baseUrl" placeholder="Base URL" required className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
              <select name="browser" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <option value="chrome">Chrome</option>
                <option value="firefox">Firefox</option>
                <option value="edge">Edge</option>
              </select>
              <select name="notifyPolicy" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <option value="on-failure">On Failure</option>
                <option value="always">Always</option>
                <option value="never">Never</option>
              </select>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-teal-500 py-3 rounded-2xl font-semibold">Create</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal (مبسط) */}
      {showEditClient && selectedClient && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0b1120] rounded-3xl p-8 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Edit Client</h3>
              <button onClick={() => setShowEditClient(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleEditClient} className="space-y-4">
              <input name="name" placeholder="Client Name" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
              <input name="baseUrl" placeholder="Base URL" value={editForm.baseUrl} onChange={e => setEditForm({...editForm, baseUrl: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
              <select name="browser" value={editForm.browser} onChange={e => setEditForm({...editForm, browser: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <option value="chrome">Chrome</option>
                <option value="firefox">Firefox</option>
                <option value="edge">Edge</option>
              </select>
              <select name="notifyPolicy" value={editForm.notifyPolicy} onChange={e => setEditForm({...editForm, notifyPolicy: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <option value="on-failure">On Failure</option>
                <option value="always">Always</option>
                <option value="never">Never</option>
              </select>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-teal-500 py-3 rounded-2xl font-semibold">Update</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && selectedClient && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0b1120] rounded-3xl p-8 w-full max-w-md border border-red-500/20 text-center">
            <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Delete Client?</h3>
            <p className="text-slate-400 mb-6">Are you sure you want to delete {selectedClient.name}? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteDialog(false)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3">Cancel</button>
              <button onClick={handleDeleteClient} className="flex-1 rounded-2xl bg-red-500 py-3 font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Run Tests Modal */}
      {showRunTests && selectedClient && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0b1120] rounded-3xl p-8 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Run Tests</h3>
              <button onClick={() => setShowRunTests(false)}><X className="w-6 h-6" /></button>
            </div>
            <p className="text-slate-400 mb-4">Starting tests for <span className="text-white font-semibold">{selectedClient.name}</span></p>
            <p className="text-sm text-slate-500 mb-6">This will execute the default test suite. (Flow selection coming soon)</p>
            <div className="flex gap-3">
              <button onClick={() => setShowRunTests(false)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3">Cancel</button>
              <button onClick={handleRunTests} className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 py-3 font-semibold">Run Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}