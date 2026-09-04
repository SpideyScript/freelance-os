import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

// Main OS Pages
import { Dashboard } from './pages/dashboard/Dashboard';
import { ClientsList } from './pages/clients/ClientsList';
import { ClientDetail } from './pages/clients/ClientDetail';
import { ProjectsList } from './pages/projects/ProjectsList';
import { ProjectDetail } from './pages/projects/ProjectDetail';
import { TasksPage } from './pages/tasks/TasksPage';
import { ProposalsList } from './pages/proposals/ProposalsList';
import { ProposalEditor } from './pages/proposals/ProposalEditor';
import { ProposalPreview } from './pages/proposals/ProposalPreview';
import { InvoicesList } from './pages/invoices/InvoicesList';
import { InvoiceBuilder } from './pages/invoices/InvoiceBuilder';
import { InvoiceView } from './pages/invoices/InvoiceView';
import { TimeTrackingPage } from './pages/time/TimeTrackingPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { CopilotPage } from './pages/copilot/CopilotPage';
import { SettingsPage } from './pages/settings/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TimerProvider>
            <NotificationProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Route>

                  {/* Protected SaaS App Routes */}
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Clients CRM */}
                    <Route path="/clients" element={<ClientsList />} />
                    <Route path="/clients/:id" element={<ClientDetail />} />

                    {/* Projects */}
                    <Route path="/projects" element={<ProjectsList />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />

                    {/* Tasks Board & List */}
                    <Route path="/tasks" element={<TasksPage />} />

                    {/* Proposals */}
                    <Route path="/proposals" element={<ProposalsList />} />
                    <Route path="/proposals/new" element={<ProposalEditor />} />
                    <Route path="/proposals/:id" element={<ProposalPreview />} />
                    <Route path="/proposals/edit/:id" element={<ProposalEditor />} />

                    {/* Invoices */}
                    <Route path="/invoices" element={<InvoicesList />} />
                    <Route path="/invoices/new" element={<InvoiceBuilder />} />
                    <Route path="/invoices/:id" element={<InvoiceView />} />
                    <Route path="/invoices/edit/:id" element={<InvoiceBuilder />} />

                    {/* Time Tracking */}
                    <Route path="/time" element={<TimeTrackingPage />} />

                    {/* Analytics */}
                    <Route path="/analytics" element={<AnalyticsPage />} />

                    {/* AI Copilot */}
                    <Route path="/copilot" element={<CopilotPage />} />

                    {/* Settings */}
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>

                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </BrowserRouter>
            </NotificationProvider>
          </TimerProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
