import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hourlyRate, setHourlyRate] = useState('75');
  const [currency, setCurrency] = useState('USD');

  // Business Details
  const [companyName, setCompanyName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [defaultPaymentTerms, setDefaultPaymentTerms] = useState('');
  const [defaultInvoiceNotes, setDefaultInvoiceNotes] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setHourlyRate(user.hourlyRate?.toString() || '75');
      setCurrency(user.currency || 'USD');
      setCompanyName(user.businessDetails?.companyName || '');
      setTaxNumber(user.businessDetails?.taxNumber || '');
      setAddress(user.businessDetails?.address || '');
      setPhone(user.businessDetails?.phone || '');
      setWebsite(user.businessDetails?.website || '');
      setDefaultPaymentTerms(user.businessDetails?.defaultPaymentTerms || 'Payment due within 14 days of invoice date.');
      setDefaultInvoiceNotes(user.businessDetails?.defaultInvoiceNotes || 'Thank you for your business! Please transfer funds via direct wire.');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfile({
        name,
        hourlyRate: parseFloat(hourlyRate) || 75,
        currency,
        businessDetails: {
          companyName,
          taxNumber,
          address,
          phone,
          website,
          defaultPaymentTerms,
          defaultInvoiceNotes,
        },
      });
      setSuccessMsg('Settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in-50">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-primary" /> Workspace & Business Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Configure default hourly rate, legal business entity, tax registration, and invoice terms.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Identity & Rates */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Freelancer Profile</CardTitle>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              value={email}
              disabled
              helperText="Contact support to update login email address"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Standard Hourly Rate ($ USD) *"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              min="1"
              required
            />

            <Select
              label="Primary Billing Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { label: 'USD ($)', value: 'USD' },
                { label: 'EUR (€)', value: 'EUR' },
                { label: 'GBP (£)', value: 'GBP' },
                { label: 'CAD ($)', value: 'CAD' },
                { label: 'AUD ($)', value: 'AUD' },
              ]}
            />
          </div>
        </Card>

        {/* Business & Legal Entity Details */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Business Entity & Invoice Branding</CardTitle>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business / Legal Entity Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Morgan Digital Engineering LLC"
            />

            <Input
              label="Tax Registration / EIN / VAT Number"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder="e.g. US-884920194"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (415) 890-3490"
            />

            <Input
              label="Portfolio / Agency Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://morgandigital.io"
            />
          </div>

          <Input
            label="Official Business Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="548 Market St, Suite 39201, San Francisco, CA 94104"
          />

          <div className="space-y-4 pt-3 border-t border-border/40">
            <Input
              label="Default Invoice Payment Terms"
              value={defaultPaymentTerms}
              onChange={(e) => setDefaultPaymentTerms(e.target.value)}
              placeholder="e.g. Payment due within 14 days of invoice date."
            />

            <Textarea
              label="Default Invoice Remittance Notes"
              value={defaultInvoiceNotes}
              onChange={(e) => setDefaultInvoiceNotes(e.target.value)}
              placeholder="Bank wire transfer details or instructions..."
              rows={2}
            />
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3">
          <Button type="submit" isLoading={isSaving} className="h-11 px-6 font-semibold">
            <Save className="h-4 w-4 mr-2" />
            Save Workspace Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
