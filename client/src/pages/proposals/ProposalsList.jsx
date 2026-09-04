import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Plus,
  Sparkles,
  Building2,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export const ProposalsList = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/proposals?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      if (res.data.success) {
        setProposals(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [search, statusFilter]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this proposal?')) {
      try {
        await api.delete(`/proposals/${id}`);
        setProposals((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error('Failed to delete proposal:', err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success" dot>Accepted</Badge>;
      case 'sent':
        return <Badge variant="info" dot>Sent</Badge>;
      case 'rejected':
        return <Badge variant="danger" dot>Rejected</Badge>;
      case 'expired':
        return <Badge variant="warning" dot>Expired</Badge>;
      default:
        return <Badge variant="outline" dot>Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <FileText className="h-7 w-7 text-purple-500" /> Proposals & Bids
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Create high-converting client proposals with AI Copilot and track deal acceptance.
          </p>
        </div>

        <Link to="/proposals/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Proposal
          </Button>
        </Link>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals by title..."
            className="h-10 w-full pl-9 pr-4 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All', value: 'all' },
            { label: 'Drafts', value: 'draft' },
            { label: 'Sent', value: 'sent' },
            { label: 'Accepted', value: 'accepted' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-4" />
                <Skeleton className="h-12 w-full" />
              </Card>
            ))}
        </div>
      ) : proposals.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No proposals found"
          description="Create your first strategic client proposal or use Freelance Copilot AI."
          actionLabel="Build First Proposal"
          onAction={() => window.location.href = '/proposals/new'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {proposals.map((proposal) => {
            const client = typeof proposal.clientId === 'object' ? proposal.clientId : null;

            return (
              <Link key={proposal._id} to={`/proposals/${proposal._id}`} className="group block">
                <Card hoverEffect className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {proposal.title}
                      </h3>
                      {getStatusBadge(proposal.status)}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{client?.name || 'Direct Client'} {client?.company ? `(${client.company})` : ''}</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                      {proposal.description}
                    </p>

                    {proposal.generatedWithAi && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold mb-3">
                        <Sparkles className="h-3 w-3" /> AI Crafted
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Total Investment</span>
                      <span className="font-bold text-foreground font-mono">
                        {formatCurrency(proposal.totalAmount, user?.currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Link to={`/proposals/edit/${proposal._id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        onClick={(e) => handleDelete(e, proposal._id)}
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
