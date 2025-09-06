import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';

const Login = () => {
  const { register: formRegister, handleSubmit } = useForm();
  const { login, error, loading, user } = useAuth();
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setLocalError(null);
  try {
    const u = await login(values.email, values.password);
    const target = u?.role === 'admin' ? '/admindashboard' : '/dashboard';
    navigate(target);
    } catch (e) {
      setLocalError(e.response?.data?.message || 'Login failed');
    }
  };

  // If user already logged in, redirect based on role automatically
  useEffect(() => {
    if (user) {
    navigate(user.role === 'admin' ? '/admindashboard' : '/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="relative mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-center gap-12 px-4 py-10 md:flex-row md:items-stretch md:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      {/* Marketing / Illustration side */}
      <div className="relative hidden flex-1 flex-col justify-center md:flex animate-fade-in">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">clarity</span></h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-400">Track every subscription, forecast renewals, and uncover savings opportunities in minutes.</p>
          <ul className="mt-8 space-y-3 text-sm text-gray-600 dark:text-gray-400">
            {['Unified dashboard','Predictive renewal alerts','Cost optimization insights'].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">✓</span><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </div>
      {/* Auth card */}
      <div className="flex w-full flex-1 items-center justify-center">
        <Card className="glass-card glass-border w-full max-w-md animate-slide-up">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
            <CardDescription>Access your subscription dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...formRegister('email', { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" {...formRegister('password', { required: true })} />
              </div>
              {(error || localError) && <p className="text-sm text-destructive">{error || localError}</p>}
              <Button disabled={loading} className="w-full font-medium" type="submit">{loading ? 'Signing in...' : 'Sign in'}</Button>
            </form>
            <p className="mt-8 text-center text-sm text-muted-foreground">No account? <Link to="/register" className="text-primary underline-offset-4 hover:underline">Create one</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
