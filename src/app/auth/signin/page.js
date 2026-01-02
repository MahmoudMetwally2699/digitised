'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '@/app/globals.css';

function SignInContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  useEffect(() => {
     if (registered) {
         setError('Account created! Please sign in.');
         // Actually using error state to show success message merely for reusing style logic or I can add a dedicated success state
     }
  }, [registered]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      const email = e.target.email.value;
      const password = e.target.password.value;

      const res = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl: '/'
      });

      if (res?.error) {
          setError('Invalid email or password');
          setIsLoading(false);
      } else {
          router.push('/');
      }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h1 className="title" style={{fontSize: '2rem'}}>Welcome Back</h1>
        <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>
          Sign in to access your Tasks & Goals
        </p>

        {registered && !isLoading && (
            <div style={{color: 'var(--success-color)', marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem'}}>
                Account created successfully!
            </div>
        )}

        {error && !registered && (
            <div style={{color: 'var(--danger-color)', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem'}}>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="form-group" style={{gap: '1rem'}}>
           <input type="email" name="email" placeholder="Email Address" required className="form-input" />
           <input type="password" name="password" placeholder="Password" required className="form-input" />

             <button
                type="submit"
                className="btn btn-primary"
                style={{width: '100%', marginTop: '0.5rem'}}
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
        </form>

        <p style={{marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
            Don't have an account? <Link href="/auth/register" style={{color: 'var(--accent-color)'}}>Create Account</Link>
        </p>

      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
