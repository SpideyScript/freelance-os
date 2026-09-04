import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { api } from '../../lib/api';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setIsSubmitted(true);
        if (res.data.data?.resetToken) {
          setResetToken(res.data.data.resetToken);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 space-y-6 shadow-xl border-border/80">
      <Link
        to="/login"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
      </Link>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Reset password
        </h2>
        <p className="text-xs text-muted-foreground">
          Enter your email to receive password reset instructions.
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="h-4 w-4" /> Reset link generated!
            </div>
            <p className="text-muted-foreground">
              Follow instructions or use demo reset token below to configure a new password.
            </p>
            {resetToken && (
              <div className="p-2 rounded bg-muted/60 font-mono text-[11px] text-foreground select-all">
                Token: {resetToken}
              </div>
            )}
          </div>

          <Link to={`/reset-password${resetToken ? `?token=${resetToken}` : ''}`}>
            <Button className="w-full">Proceed to Reset Password</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <Input
            label="Account Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@freelanceos.dev"
            required
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Send Reset Instructions
          </Button>
        </form>
      )}
    </Card>
  );
};
