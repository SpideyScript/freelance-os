import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  FileText,
  Lightbulb,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { api } from '../../lib/api';

export const CopilotPage = () => {
  const [activeTab, setActiveTab] = useState('chat');

  // Chat State
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        '👋 Welcome to **Freelance Copilot**! I am your AI Business Partner with full real-time awareness of your clients, projects, tasks, and outstanding invoices.\n\nAsk me for strategic guidance, draft messages, or request workload breakdowns.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [conversationId, setConversationId] = useState(undefined);
  const chatEndRef = useRef(null);

  // Business Advisor State
  const [advisorData, setAdvisorData] = useState(null);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);

  // Meeting Summarizer State
  const [meetingNotes, setMeetingNotes] = useState('');
  const [meetingClientName, setMeetingClientName] = useState('');
  const [meetingProjectName, setMeetingProjectName] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [meetingSummary, setMeetingSummary] = useState(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChat = async (promptText) => {
    const text = promptText || input;
    if (!text.trim() || isChatLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    if (!promptText) setInput('');
    setIsChatLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: text,
        conversationId,
      });

      if (res.data.success) {
        setConversationId(res.data.data.conversationId);
        setMessages((prev) => [...prev, { role: 'assistant', content: res.data.data.reply }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Copilot encountered an issue. Please try again.' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const fetchAdvisorInsights = async () => {
    try {
      setIsAdvisorLoading(true);
      const res = await api.get('/ai/business-advisor');
      if (res.data.success) {
        setAdvisorData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load advisor:', err);
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'advisor' && !advisorData) {
      fetchAdvisorInsights();
    }
  }, [activeTab]);

  const handleSummarizeMeeting = async (e) => {
    e.preventDefault();
    if (!meetingNotes.trim()) return;

    setIsSummarizing(true);
    try {
      const res = await api.post('/ai/summarize-meeting', {
        rawNotes: meetingNotes,
        clientName: meetingClientName || undefined,
        projectName: meetingProjectName || undefined,
      });

      if (res.data.success) {
        setMeetingSummary(res.data.data);
      }
    } catch (err) {
      console.error('Failed to summarize notes:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopyEmail = () => {
    if (!meetingSummary) return;
    navigator.clipboard.writeText(meetingSummary.followUpEmailDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Bot className="h-7 w-7 text-emerald-500" /> Freelance Copilot AI
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your context-aware AI partner for strategy, task prioritization, client messaging, and meeting summarization.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        {[
          { id: 'chat', label: 'AI Copilot Chat', icon: Bot },
          { id: 'advisor', label: 'Business Health & Insights', icon: Lightbulb },
          { id: 'meeting_summarizer', label: 'Meeting Notes Summarizer', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: AI Copilot Chat */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Chat Conversation */}
          <Card className="lg:col-span-3 p-0 overflow-hidden flex flex-col h-[600px]">
            <div className="p-3.5 border-b border-border bg-muted/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-foreground">Freelance Copilot Session</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">Scoped Context Active</span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-card border border-border/70 text-foreground rounded-tl-none shadow-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex gap-2 items-center text-xs text-muted-foreground">
                  <Bot className="h-4 w-4 animate-spin text-primary" />
                  <span>Copilot is analyzing your active pipeline...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="p-3 border-t border-border bg-card flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot anything (e.g. 'What should I work on today?', 'Draft a follow-up')..."
                className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" variant="copilot" disabled={!input.trim() || isChatLoading} size="sm" className="h-10 px-4">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Card>

          {/* Quick Prompt Cards Sidebar */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Suggested Queries
            </span>

            {[
              { label: 'What should I work on today?', desc: 'Prioritize daily high-yield tasks' },
              { label: 'Which clients owe me money?', desc: 'Check overdue invoice amounts' },
              { label: 'How much did I earn this month?', desc: 'Review current billing performance' },
              { label: 'Draft a client follow-up message', desc: 'Generate high-conversion email' },
              { label: 'Why did my revenue decrease?', desc: 'Audit billable utilization' },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(chip.label)}
                className="w-full text-left p-3 rounded-xl border border-border bg-card hover:border-primary/50 text-xs transition-all card-hover space-y-1 block"
              >
                <div className="font-bold text-foreground flex items-center justify-between">
                  <span>{chip.label}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-[10px] text-muted-foreground">{chip.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Business Advisor Insights */}
      {activeTab === 'advisor' && (
        <div className="space-y-6">
          {isAdvisorLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : advisorData ? (
            <>
              {/* Health Score Hero */}
              <Card className="p-6 bg-gradient-to-r from-emerald-950/60 to-slate-900 border-emerald-500/30 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                    Autonomous Business Health Score
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold">{advisorData.healthScore}/100 Rating</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    {advisorData.effectiveHourlyRateAnalysis}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center shrink-0">
                  <span className="text-[10px] text-slate-300 uppercase font-bold block">Pricing Recommendation</span>
                  <span className="text-xs font-bold text-emerald-300 mt-1 block max-w-[200px]">
                    {advisorData.pricingAdvice}
                  </span>
                </div>
              </Card>

              {/* Strategic Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {advisorData.insights.map((ins, i) => (
                  <Card key={i} className="flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge
                          variant={
                            ins.impact === 'positive'
                              ? 'success'
                              : ins.impact === 'warning'
                              ? 'warning'
                              : 'info'
                          }
                          className="text-[10px]"
                        >
                          {ins.type?.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-sm text-foreground">{ins.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ins.description}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs">
                      <span className="font-bold text-foreground block mb-0.5">Recommended Move:</span>
                      <p className="text-muted-foreground text-[11px]">{ins.recommendedAction}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-12">No insights generated</p>
          )}
        </div>
      )}

      {/* Tab 3: Meeting Notes Summarizer */}
      {activeTab === 'meeting_summarizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notes Input */}
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Raw Meeting Notes Input</CardTitle>
            </CardHeader>

            <form onSubmit={handleSummarizeMeeting} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Client Name"
                  value={meetingClientName}
                  onChange={(e) => setMeetingClientName(e.target.value)}
                  placeholder="e.g. Vortex FinTech AI"
                />
                <Input
                  label="Project Name"
                  value={meetingProjectName}
                  onChange={(e) => setMeetingProjectName(e.target.value)}
                  placeholder="e.g. Trading Terminal Rebuild"
                />
              </div>

              <Textarea
                label="Raw Unstructured Meeting Notes *"
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                placeholder="Paste rough bullet points, transcript snippets, or client requests here..."
                rows={8}
                required
              />

              <Button
                type="submit"
                variant="copilot"
                isLoading={isSummarizing}
                className="w-full h-11 text-sm font-semibold"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Extract Action Items & Draft Email
              </Button>
            </form>
          </Card>

          {/* Extracted Decisions & Follow-up Draft */}
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Structured Brief & Action Plan</CardTitle>
            </CardHeader>

            {!meetingSummary ? (
              <p className="text-xs text-muted-foreground text-center py-20">
                Paste meeting notes on the left and click "Extract Action Items" to generate structured decisions and an email draft.
              </p>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Summary Box */}
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20">
                  <span className="font-bold text-primary block mb-1">Executive Summary:</span>
                  <p className="text-foreground leading-relaxed">{meetingSummary.summary}</p>
                </div>

                {/* Key Decisions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Key Decisions Made:</span>
                  {meetingSummary.keyDecisions?.map((dec, i) => (
                    <div key={i} className="flex items-start gap-2 text-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{dec}</span>
                    </div>
                  ))}
                </div>

                {/* Action Items */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Action Items & Deadlines:</span>
                  {meetingSummary.actionItems?.map((act, i) => (
                    <div key={i} className="p-2 rounded-lg bg-muted/40 flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{act.task}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{act.deadline}</span>
                    </div>
                  ))}
                </div>

                {/* Follow-up Email Draft */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Follow-up Email Draft:</span>
                    <Button onClick={handleCopyEmail} variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      {copiedDraft ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedDraft ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-muted/20 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                    {meetingSummary.followUpEmailDraft}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
