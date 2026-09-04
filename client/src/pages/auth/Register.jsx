import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Zap, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hourlyRate, setHourlyRate] = useState('85');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({
        name,
        email,
        password,
        hourlyRate: parseFloat(hourlyRate) || 85,
        currency: 'USD',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 space-y-6 shadow-xl border-border/80">
      <div className="space-y-2 text-center">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 items-center justify-center mb-2 shadow-glow">
          <Zap className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Create OS Account
        </h2>
        <p className="text-xs text-muted-foreground">
          Launch your autonomous freelance SaaS hub in 30 seconds.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name / Studio Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alex Rivera"
          required
        />

        <Input
          label="Work Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="alex@studio.design"
          required
        />

        <Input
          label="Password (min 6 characters)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Input
          label="Default Hourly Rate ($ USD)"
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          min="1"
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full h-11 text-sm font-semibold">
          Create Workspace
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </Card>
  );
};
