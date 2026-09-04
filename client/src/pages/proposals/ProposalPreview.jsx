import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  Printer,
  Edit2,
  CheckCircle2,
  Send,
  Building2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { api } from "../../lib/api";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export const ProposalPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [proposal, setProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProposal = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await api.get(`/proposals/${id}`);
      if (res.data.success) {
        setProposal(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load proposal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    if (!proposal) return;
    try {
      const res = await api.put(`/proposals/${proposal._id}`, {
        status: newStatus,
      });
      if (res.data.success) {
        setProposal(res.data.data);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Proposal not found</p>
        <Button
          onClick={() => navigate("/proposals")}
          variant="outline"
          className="mt-4"
        >
          Back to Proposals
        </Button>
      </div>
    );
  }

  const client =
    typeof proposal.clientId === "object" ? proposal.clientId : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in-50">
      {/* Top Controls (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to="/proposals"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Proposals
        </Link>

        <div className="flex items-center gap-2">
          {proposal.status === "draft" && (
            <Button
              onClick={() => handleUpdateStatus("sent")}
              variant="secondary"
              size="sm"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" /> Mark as Sent
            </Button>
          )}

          {proposal.status !== "accepted" && (
            <Button
              onClick={() => handleUpdateStatus("accepted")}
              size="sm"
              variant="primary"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" /> Mark as Accepted
            </Button>
          )}

          <Link to={`/proposals/edit/${proposal._id}`}>
            <Button variant="secondary" size="sm">
              <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
          </Link>

          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="h-3.5 w-3.5 mr-1.5" /> Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Printable Proposal Document */}
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                {user?.name?.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-bold text-base text-foreground">
                {user?.businessDetails?.companyName || user?.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.businessDetails?.address || "San Francisco, CA"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.email} • {user?.businessDetails?.phone}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-primary block">
              Client Proposal
            </span>
            <h2 className="text-sm font-mono text-muted-foreground mt-0.5">
              Ref: PR-{proposal._id.slice(-6).toUpperCase()}
            </h2>
            <div className="mt-2">
              <Badge
                variant={proposal.status === "accepted" ? "success" : "info"}
                dot
              >
                Status: {proposal.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Prepared For & Expiry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-muted/30 border border-border/40 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
              Prepared For
            </span>
            <h4 className="font-bold text-sm text-foreground">
              {client?.name}
            </h4>
            <p className="text-muted-foreground">
              {client?.company || "Direct Client"}
            </p>
            <p className="text-muted-foreground">{client?.email}</p>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">
              Timeline & Validity
            </span>
            <p className="font-semibold text-foreground">
              Estimated: {proposal.timeline || "4-6 weeks"}
            </p>
            {proposal.expirationDate && (
              <p className="text-muted-foreground">
                Valid until: {formatDate(proposal.expirationDate)}
              </p>
            )}
          </div>
        </div>

        {/* Proposal Title & Narrative */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
            {proposal.title}
          </h2>

          <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {proposal.description}
          </div>
        </div>

        {/* Deliverables Checklist */}
        {proposal.deliverables && proposal.deliverables.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border/40">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Key Deliverables & Milestones
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {proposal.deliverables.map((del, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 text-xs text-foreground p-2.5 rounded-xl bg-muted/20 border border-border/30"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{del}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services & Investment Table */}
        <div className="space-y-3 pt-4 border-t border-border/40">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Scope & Commercial Investment
          </h3>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Phase / Scope</th>
                  <th className="p-3 text-right">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {proposal.services.map((srv, idx) => (
                  <tr key={idx}>
                    <td className="p-3">
                      <p className="font-bold text-foreground">{srv.name}</p>
                      {srv.description && (
                        <p className="text-muted-foreground text-[11px]">
                          {srv.description}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-foreground">
                      {formatCurrency(srv.amount, user?.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30 border-t border-border font-bold">
                <tr>
                  <td className="p-3.5 text-foreground text-sm">
                    Total Proposed Investment
                  </td>
                  <td className="p-3.5 text-right font-mono text-base text-primary font-extrabold">
                    {formatCurrency(proposal.totalAmount, user?.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {proposal.pricingExplanation && (
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {proposal.pricingExplanation}
            </p>
          )}
        </div>

        {/* Terms & Conditions */}
        {proposal.terms && (
          <div className="space-y-2 pt-4 border-t border-border/40 text-xs text-muted-foreground">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[11px]">
              Terms & Conditions
            </h4>
            <p className="leading-relaxed">{proposal.terms}</p>
          </div>
        )}

        {/* Sign-off CTA / Signature Block */}
        <div className="pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
          <div>
            <p className="text-xs font-semibold text-foreground mb-4">
              {proposal.callToAction || "Accepted and agreed by Client:"}
            </p>
            <div className="h-16 border-b border-dashed border-border flex items-end pb-1">
              <span className="text-[10px] text-muted-foreground font-mono">
                Client Authorized Signature
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Date: ________________________
            </p>
          </div>

          <div className="sm:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 font-semibold text-xs border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" />
              <span>Prepared with Morgan Digital SaaS Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
