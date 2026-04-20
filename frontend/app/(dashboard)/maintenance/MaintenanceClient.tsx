"use client";

import { useState } from "react";
import { Card, Button, Input, Textarea, Label } from "@/components/ui";
import {
  Wrench,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  Image as ImageIcon,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";
import { toast } from "sonner";

export function MaintenanceClient({
  isAdmin,
  currentUser,
}: {
  isAdmin: boolean;
  currentUser: any;
}) {
  const [requests, setRequests] = useState([
    {
      id: "1",
      title: "Leaky Faucet in Kitchen",
      description:
        "The kitchen faucet has been dripping constantly since yesterday. It's pooling under the sink.",
      status: "pending",
      created_at: new Date().toISOString(),
      resident: { name: "Resident John", id: "user-1", unit: "Apt 4B" },
    },
    {
      id: "3",
      title: "Elevator rattling noise",
      description:
        "Elevator B makes a loud rattling sound when moving past the 4th floor.",
      status: "in_progress",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      resident: { name: "Jane Doe", id: "user-3", unit: "Penthouse" },
    },
    {
      id: "2",
      title: "Broken Light Bulb in Hallway",
      description:
        "The light fixture on the 3rd floor hallway is out completely rendering it pitch black.",
      status: "resolved",
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      resident: { name: "Alice Smith", id: "user-2", unit: "Apt 3A" },
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-semibold text-xs">
            <AlertTriangle className="w-3.5 h-3.5" /> Awaiting Review
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold text-xs">
            <Clock className="w-3.5 h-3.5" /> Tech Dispatched
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border font-semibold text-xs">
            <CircleDashed className="w-3.5 h-3.5" /> Unknown
          </span>
        );
    }
  };

  const handleCreate = () => {
    if (!formData.title) return;

    setRequests([
      {
        id: Date.now().toString(),
        ...formData,
        status: "pending",
        created_at: new Date().toISOString(),
        resident: {
          name: "Resident User",
          id: currentUser?.id || "user-1",
          unit: "Apt 00",
        },
      },
      ...requests,
    ]);
    setIsModalOpen(false);
    setFormData({ title: "", description: "" });
    toast.success("Maintenance ticket generated successfully.");
  };

  const updateStatus = (id: string, newStatus: string) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
    toast.info(`Ticket status updated to ${newStatus.replace("_", " ")}`);
  };

  const filteredRequests = isAdmin
    ? requests
    : requests.filter((r) => r.resident.id === (currentUser?.id || "user-1"));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            {isAdmin ? "Facility Tickets" : "My Requests"}{" "}
            <Wrench className="h-6 w-6 text-amber-500" />
          </h1>
          <p className="text-muted-foreground mt-2">
            {isAdmin
              ? "Oversee, assign, and resolve property issues."
              : "Log and track your maintenance needs."}
          </p>
        </div>
        {!isAdmin && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20 hover:shadow-amber-500/40">
            <Plus className="mr-2 h-4 w-4" /> Open New Ticket
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {filteredRequests.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 bg-muted/10">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Zero Active Tickets
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Everything is running smoothly! There are no open facility
              maintenance logs matching your criteria.
            </p>
            {!isAdmin && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-6"
                variant="outline">
                Need fixing?
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {filteredRequests.map((req) => (
              <Card
                key={req.id}
                className="flex flex-col p-0 overflow-hidden shadow-sm hover:shadow-md transition-all group border-border">
                <div className="p-6 pb-4 border-b border-border bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-amber-500 transition-colors">
                      {req.title}
                    </h3>
                    <div className="shrink-0">{getStatusBadge(req.status)}</div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {req.description}
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                    <span className="bg-muted px-2 py-1 rounded text-foreground/70 border border-border/50">
                      {req.resident.unit}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="p-3 bg-muted/20 flex flex-wrap items-center justify-end gap-3 text-sm">
                    <span className="mr-auto font-medium text-muted-foreground text-xs px-3">
                      Reported by{" "}
                      <span className="text-foreground">
                        {req.resident.name}
                      </span>
                    </span>
                    {req.status === "pending" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateStatus(req.id, "in_progress")}
                        className="h-8 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20">
                        Dispatch Tech
                      </Button>
                    )}
                    {(req.status === "pending" ||
                      req.status === "in_progress") && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(req.id, "resolved")}
                        className="h-8 bg-emerald-500 text-white hover:bg-emerald-600">
                        Mark Fixed
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl border-amber-500/20 translate-y-0 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Wrench className="h-5 w-5 text-amber-500" /> Need Maintenance?
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3 relative group">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Short Summary
                </Label>
                <Input
                  placeholder="e.g., A/C Unit vibrating loudly"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="font-medium bg-card group-hover:border-amber-500/50 transition-colors"
                />
              </div>
              <div className="space-y-3 relative group">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Problem Details
                </Label>
                <Textarea
                  placeholder="Describe where the issue is and when it started..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-[120px] bg-card resize-none group-hover:border-amber-500/50 transition-colors"
                />
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-500/5">
                  <ImageIcon className="h-4 w-4 mr-2" /> Attach Photo (Optional)
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/10">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-500/20">
                Submit Ticket
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
