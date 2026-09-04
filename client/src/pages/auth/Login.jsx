import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('alex@freelanceos.dev');
    setPassword('password123');
  };

  return (
    <Card className="p-8 space-y-6 shadow-xl border-border/80">
      <div className="space-y-2 text-center">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 items-center justify-center mb-2 shadow-glow">
          <Zap className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="text-xs text-muted-foreground">
          Enter your credentials to access your freelance operating system.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Banner */}
      <div
        onClick={handleQuickDemoFill}
        className="p-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer text-xs flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <div>
            <span className="font-semibold text-foreground">Click for Demo Credentials</span>
            <p className="text-[10px] text-muted-foreground font-mono">alex@freelanceos.dev • password123</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-primary uppercase">Autofill</span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Work Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          required
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full h-11 text-sm font-semibold">
          Sign In to Workspace
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:underline font-semibold">
          Create an account
        </Link>
      </div>
    </Card>
  );
};
