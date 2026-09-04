import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';

export const ClientModal = ({ isOpen, onClose, onSaved, client }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('active');
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setEmail(client.email || '');
      setCompany(client.company || '');
      setPhone(client.phone || '');
      setAddress(client.address || '');
      setCurrency(client.currency || 'USD');
      setStatus(client.status || 'active');
      setTagsInput((client.tags || []).join(', '));
      setNotes(client.notes || '');
    } else {
      setName('');
      setEmail('');
      setCompany('');
      setPhone('');
      setAddress('');
      setCurrency('USD');
      setStatus('active');
      setTagsInput('');
      setNotes('');
    }
    setError('');
  }, [client, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name,
      email,
      company,
      phone,
      address,
      currency,
      status,
      tags,
      notes,
    };

    try {
      if (client) {
        await api.put(`/clients/${client._id}`, payload);
      } else {
        await api.post('/clients', payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save client account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? 'Edit Client Account' : 'Add New Client'}
      description="Create a client record to track projects, billable invoices, and communications."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Client Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sarah Jenkins"
            required
          />
          <Input
            label="Email Address *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@acme.inc"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company / Brand Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme FinTech Corp"
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (415) 890-1234"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Account Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: 'Active Retainer / Client', value: 'active' },
              { label: 'Lead / Prospect', value: 'lead' },
              { label: 'Inactive / Past', value: 'inactive' },
            ]}
          />
          <Select
            label="Default Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={[
              { label: 'USD ($)', value: 'USD' },
              { label: 'EUR (€)', value: 'EUR' },
              { label: 'GBP (£)', value: 'GBP' },
              { label: 'CAD ($)', value: 'CAD' },
            ]}
          />
        </div>

        <Input
          label="Billing Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="100 Montgomery St, Suite 400, San Francisco, CA"
        />

        <Input
          label="Tags (Comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Enterprise, React, FinTech, Retainer"
        />

        <Textarea
          label="Internal Client Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Key stakeholders, preferred communication channels, billing terms..."
          rows={3}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {client ? 'Save Changes' : 'Create Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
