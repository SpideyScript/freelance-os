import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Receipt,
  Search,
  Plus,
  IndianRupee,
  AlertTriangle,
  Building2,
  Trash2,
  Edit2,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { api } from "../../lib/api";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export const InvoicesList = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(
        `/invoices?search=${encodeURIComponent(search)}&status=${statusFilter}`,
      );
      if (res.data.success) {
        setInvoices(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [search, statusFilter]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this invoice?")) {
      try {
        await api.delete(`/invoices/${id}`);
        setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      } catch (err) {
        console.error("Failed to delete invoice:", err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="success" dot>
            Paid
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="danger" dot>
            Overdue
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="info" dot>
            Sent
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" dot>
            Draft
          </Badge>
        );
      default:
        return (
          <Badge variant="default" dot>
            {status}
          </Badge>
        );
    }
  };

  const totalPaid = invoices
    .filter((i) => i.paymentStatus === "paid")
    .reduce((s, i) => s + (i.total || 0), 0);
  const totalPending = invoices
    .filter((i) => i.paymentStatus === "sent" || i.paymentStatus === "overdue")
    .reduce((s, i) => s + (i.total || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Receipt className="h-7 w-7 text-emerald-500" /> Invoices & Billing
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Create professional invoices, monitor receivables aging, and
            automate payment reminders.
          </p>
        </div>

        <Link to="/invoices/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 flex items-center justify-between bg-emerald-500/5 border-emerald-500/20">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Total Collected
            </span>
            <span className="text-xl font-bold font-mono text-emerald-500">
              {formatCurrency(totalPaid, user?.currency)}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <IndianRupee className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between bg-amber-500/5 border-amber-500/20">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Pending / Overdue
            </span>
            <span className="text-xl font-bold font-mono text-amber-500">
              {formatCurrency(totalPending, user?.currency)}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice number..."
            className="h-10 w-full pl-9 pr-4 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: "All Invoices", value: "all" },
            { label: "Paid", value: "paid" },
            { label: "Sent", value: "sent" },
            { label: "Overdue", value: "overdue" },
            { label: "Draft", value: "draft" },
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

      {/* Invoices List / Table */}
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-40 w-full" />
        </Card>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No invoices found"
          description="Create your first client invoice to bill for milestones or tracked time."
          actionLabel="Create Invoice"
          onAction={() => (window.location.href = "/invoices/new")}
        />
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => {
            const client =
              typeof inv.clientId === "object" ? inv.clientId : null;
            const project =
              typeof inv.projectId === "object" ? inv.projectId : null;

            return (
              <Link
                key={inv._id}
                to={`/invoices/${inv._id}`}
                className="group block"
              >
                <Card
                  hoverEffect
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      INV
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-foreground font-mono group-hover:text-primary transition-colors">
                          {inv.invoiceNumber}
                        </span>
                        {getStatusBadge(inv.paymentStatus)}
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>
                          {client?.name || "Direct Client"}{" "}
                          {client?.company ? `(${client.company})` : ""}
                        </span>
                        {project && <span>• {project.name}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <div className="text-left sm:text-right font-mono">
                      <span className="font-bold text-sm sm:text-base text-foreground block">
                        {formatCurrency(inv.total, user?.currency)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Due {formatDate(inv.dueDate)}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link to={`/invoices/edit/${inv._id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        onClick={(e) => handleDelete(e, inv._id)}
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
            );
          })}
        </div>
      )}
    </div>
  );
};
