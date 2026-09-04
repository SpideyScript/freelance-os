import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Sparkles,
  Edit2,
  IndianRupee,
  Briefcase,
  Receipt,
  Layers,
  Copy,
  Check,
  Send,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { Modal } from "../../components/ui/Modal";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Input";
import { ClientModal } from "./ClientModal";
import { api } from "../../lib/api";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // AI Message Drafter Modal
  const [isAiMessageModalOpen, setIsAiMessageModalOpen] = useState(false);
  const [messageIntent, setMessageIntent] = useState("project_update");
  const [messageTone, setMessageTone] = useState("professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [isGeneratingAiMessage, setIsGeneratingAiMessage] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const fetchClientDetail = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/clients/${id}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load client detail:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetail();
  }, [id]);

  const handleGenerateAiMessage = async (e) => {
    e.preventDefault();
    setIsGeneratingAiMessage(true);
    try {
      const res = await api.post("/ai/message", {
        clientId: id,
        recipientName: data?.client?.name,
        intent: messageIntent,
        tone: messageTone,
        keyPoints,
        projectName: data?.projects?.[0]?.name,
      });

      if (res.data.success) {
        setGeneratedMessage(res.data.data);
      }
    } catch (err) {
      console.error("Failed to generate AI message:", err);
    } finally {
      setIsGeneratingAiMessage(false);
    }
  };

  const handleCopyMessage = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(
      `Subject: ${generatedMessage.subject}\n\n${generatedMessage.body}`,
    );
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data?.client) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">
          Client account not found
        </p>
        <Button
          onClick={() => navigate("/clients")}
          variant="outline"
          className="mt-4"
        >
          Back to Clients
        </Button>
      </div>
    );
  }

  const { client, projects, invoices, activities } = data;

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Back Link & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/clients"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Clients CRM
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => {
              setGeneratedMessage(null);
              setIsAiMessageModalOpen(true);
            }}
            variant="copilot"
            size="sm"
            className="text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Draft Message with AI
          </Button>

          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="secondary"
            size="sm"
          >
            <Edit2 className="h-3.5 w-3.5 mr-1.5" />
            Edit Client
          </Button>
        </div>
      </div>

      {/* Hero Client Card */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-extrabold flex items-center justify-center text-xl shadow-glow shrink-0">
              {client.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {client.name}
                </h1>
                <Badge
                  variant={client.status === "active" ? "success" : "default"}
                  dot
                >
                  {client.status.toUpperCase()}
                </Badge>
              </div>

              {client.company && (
                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1 mt-0.5">
                  <Building2 className="h-3.5 w-3.5" /> {client.company}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {client.email}
                </span>
                {client.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {client.phone}
                  </span>
                )}
                {client.address && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {client.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Lifetime Value Metric */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-left lg:text-right shrink-0">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">
              Lifetime Value
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-500 block mt-0.5">
              {formatCurrency(client.totalRevenue, user?.currency)}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {invoices.length} invoices generated
            </span>
          </div>
        </div>
      </Card>

      {/* Projects & Invoices Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card className="space-y-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-amber-500" />
              <CardTitle>Client Projects ({projects.length})</CardTitle>
            </div>
            <Link
              to="/projects"
              className="text-xs text-primary hover:underline"
            >
              All Projects
            </Link>
          </CardHeader>

          {projects.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No projects linked to this client yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {projects.map((p) => (
                <Link
                  key={p._id}
                  to={`/projects/${p._id}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors text-xs block group"
                >
                  <div>
                    <h5 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {p.name}
                    </h5>
                    <p className="text-muted-foreground text-[10px] capitalize mt-0.5">
                      Status: {p.status.replace("_", " ")} • Budget:{" "}
                      {formatCurrency(p.budget, user?.currency)}
                    </p>
                  </div>
                  <Badge
                    variant={p.status === "completed" ? "success" : "info"}
                    className="text-[10px]"
                  >
                    {p.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Invoices List */}
        <Card className="space-y-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-purple-500" />
              <CardTitle>Invoices & Billings ({invoices.length})</CardTitle>
            </div>
            <Link
              to="/invoices/new"
              className="text-xs text-primary hover:underline"
            >
              New Invoice
            </Link>
          </CardHeader>

          {invoices.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No invoices created for this client yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {invoices.map((inv) => (
                <Link
                  key={inv._id}
                  to={`/invoices/${inv._id}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors text-xs block group"
                >
                  <div>
                    <span className="font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                      {inv.invoiceNumber}
                    </span>
                    <p className="text-muted-foreground text-[10px] mt-0.5">
                      Due: {formatDate(inv.dueDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-foreground block">
                      {formatCurrency(inv.total, user?.currency)}
                    </span>
                    <Badge
                      variant={
                        inv.paymentStatus === "paid"
                          ? "success"
                          : inv.paymentStatus === "overdue"
                            ? "danger"
                            : "info"
                      }
                      className="text-[10px]"
                    >
                      {inv.paymentStatus}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Edit Client Modal */}
      <ClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={fetchClientDetail}
        client={client}
      />

      {/* AI Client Message Drafter Modal */}
      <Modal
        isOpen={isAiMessageModalOpen}
        onClose={() => setIsAiMessageModalOpen(false)}
        title="AI Client Communication Drafter"
        description="Freelance Copilot writes tailored, professional emails for follow-ups, deliverable updates, and billing."
        size="lg"
      >
        {!generatedMessage ? (
          <form onSubmit={handleGenerateAiMessage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Message Intent"
                value={messageIntent}
                onChange={(e) => setMessageIntent(e.target.value)}
                options={[
                  {
                    label: "Project Milestone Progress Update",
                    value: "project_update",
                  },
                  {
                    label: "Follow-up on Proposal / Feedback",
                    value: "proposal_followup",
                  },
                  {
                    label: "Gentle Invoice Payment Reminder",
                    value: "invoice_reminder",
                  },
                  { label: "Project Kickoff / Onboarding", value: "kickoff" },
                  {
                    label: "Feedback / Review Request",
                    value: "feedback_request",
                  },
                ]}
              />

              <Select
                label="Communication Tone"
                value={messageTone}
                onChange={(e) => setMessageTone(e.target.value)}
                options={[
                  { label: "Professional & Polished", value: "professional" },
                  { label: "Friendly & Casual", value: "friendly" },
                  { label: "Concise & Direct", value: "concise" },
                  { label: "Persuasive & Executive", value: "persuasive" },
                ]}
              />
            </div>

            <Textarea
              label="Key Context / Specific Points to Include"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="e.g. Completed WebSocket refactor, deployed staging preview link, need approval for Phase 2 kickoff..."
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAiMessageModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="copilot"
                isLoading={isGeneratingAiMessage}
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                Generate Email Draft
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="font-semibold text-muted-foreground">
                  Subject Line:
                </span>
                <span className="font-bold text-foreground">
                  {generatedMessage.subject}
                </span>
              </div>
              <div className="font-mono whitespace-pre-wrap leading-relaxed text-foreground/90">
                {generatedMessage.body}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                onClick={() => setGeneratedMessage(null)}
                variant="outline"
                size="sm"
              >
                Regenerate
              </Button>
              <Button onClick={handleCopyMessage} variant="primary" size="sm">
                {copiedDraft ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5 text-emerald-300" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1.5" />
                    Copy Email Text
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
