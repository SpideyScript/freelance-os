import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { api } from '../../lib/api';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      if (res.data.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
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
          Set new password
        </h2>
        <p className="text-xs text-muted-foreground">
          Enter your reset token and new account credentials.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Password updated successfully!</p>
            <p className="text-muted-foreground">Redirecting to login in a moment...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <Input
            label="Reset Token *"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste reset token here"
            required
          />

          <Input
            label="New Password (min 6 characters) *"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirm Password *"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Save New Password
          </Button>
        </form>
      )}
    </Card>
  );
};
