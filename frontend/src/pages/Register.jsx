import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
const Register = () => {
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser, loading, error } = useAuth();
  const [successMsg, setSuccessMsg] = useState(null);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setLocalError(null); setSuccessMsg(null);
    try {
  const { message } = await registerUser(values);
      setSuccessMsg(message || 'Registration successful. Check your email to verify.');
      setTimeout(()=> navigate('/login'), 1800);
    } catch (e) {
      // Check for validation errors array from express-validator
      if (e.response?.data?.errors && Array.isArray(e.response.data.errors)) {
        const errorMessages = e.response.data.errors.map(err => err.msg).join('. ');
        setLocalError(errorMessages);
      } else {
        setLocalError(e.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="relative mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-center gap-12 px-4 py-10 md:flex-row md:items-stretch md:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      {/* Marketing / Illustration side */}
      <div className="relative hidden flex-1 flex-col justify-center md:flex animate-fade-in">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Create an account with powerful <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">controls</span></h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-400">Start mapping spend patterns, get proactive alerts, and eliminate unused subscriptions.</p>
          <ul className="mt-8 space-y-3 text-sm text-gray-600 dark:text-gray-400">
            {['Quick onboarding','Secure authentication','Scalable insights'].map(item => (
              <li key={item} className="flex items-start gap-2"><span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">✓</span><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </div>
      {/* Registration card */}
      <div className="flex w-full flex-1 items-center justify-center">
        <Card className="glass-card glass-border w-full max-w-md animate-slide-up">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
            <CardDescription>Start optimizing recurring spend</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" placeholder="Enter you name" {...formRegister('name', { required: 'Name is required' })} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email id" {...formRegister('email', { required: 'Email is required', pattern: { value: /[^@\s]+@[^@\s]+\.[^@\s]+/, message: 'Invalid email' } })} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="Enter your Mobile number" {...formRegister('phone', { required: 'Phone is required', minLength: { value: 7, message: 'Too short' }, maxLength: { value: 15, message: 'Too long' }, pattern: { value: /^[0-9+\-() ]+$/, message: 'Invalid phone' } })} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" {...formRegister('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Must contain uppercase, lowercase, and number' } })} />
                  {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                  <p className="text-[10px] text-muted-foreground">Use at least 8 characters with uppercase, lowercase, and a number.</p>
                </div>
              </div>
              {(error || localError) && <p className="text-sm text-destructive">{error || localError}</p>}
              {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}
              <Button disabled={loading} className="w-full font-medium" type="submit">{loading ? 'Creating account...' : 'Create account'}</Button>
            </form>
            <p className="mt-8 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary underline-offset-4 hover:underline">Sign in</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
