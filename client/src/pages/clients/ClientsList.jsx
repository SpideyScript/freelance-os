import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  IndianRupee,
  ArrowRight,
  MoreVertical,
  Trash2,
  Edit2,
  Sparkles,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { ClientModal } from "./ClientModal";
import { api } from "../../lib/api";
import { formatCurrency } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export const ClientsList = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(
        `/clients?search=${encodeURIComponent(search)}&status=${statusFilter}`,
      );
      if (res.data.success) {
        setClients(res.data.data.clients || []);
      }
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search, statusFilter]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm("Are you sure you want to delete this client account?")
    ) {
      try {
        await api.delete(`/clients/${id}`);
        setClients((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        console.error("Failed to delete client:", err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="success" dot>
            Active
          </Badge>
        );
      case "lead":
        return (
          <Badge variant="info" dot>
            Lead
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="default" dot>
            Inactive
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" dot>
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="h-7 w-7 text-primary" /> Clients CRM
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your client accounts, lifetime revenue, and historical
            project communications.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Client
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients by name, company, or email..."
            className="h-10 w-full pl-9 pr-4 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: "All Accounts", value: "all" },
            { label: "Active", value: "active" },
            { label: "Leads", value: "lead" },
            { label: "Inactive", value: "inactive" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
        </div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients found"
          description="Create your first client record or adjust search filters to find existing accounts."
          actionLabel="Add New Client"
          onAction={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => (
            <Link
              key={client._id}
              to={`/clients/${client._id}`}
              className="group block"
            >
              <Card
                hoverEffect
                className="h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 text-emerald-500 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                        {client.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                          {client.name}
                        </h3>
                        {client.company && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" /> {client.company}
                          </span>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(client.status)}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 text-xs text-muted-foreground mb-4">
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </p>
                    {client.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{client.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  {client.tags && client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {client.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Lifetime Revenue
                    </span>
                    <span className="font-bold text-foreground font-mono">
                      {formatCurrency(client.totalRevenue, user?.currency)}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingClient(client);
                        setIsModalOpen(true);
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      onClick={(e) => handleDelete(e, client._id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchClients}
        client={editingClient}
      />
    </div>
  );
};
