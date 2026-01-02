'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../actions';
import Link from 'next/link';
import '@/app/globals.css';

export default function SignUp() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      router.push('/auth/signin?registered=true');
    }
  }

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h1 className="title" style={{fontSize: '2rem'}}>Create Account</h1>
        <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>
          Join to manage your tasks effectively
        </p>

        {error && (
            <div style={{color: 'var(--danger-color)', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem'}}>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="form-group" style={{gap: '1rem'}}>
          <input type="text" name="name" placeholder="Full Name" required className="form-input" />
          <input type="email" name="email" placeholder="Email Address" required className="form-input" />
          <input type="password" name="password" placeholder="Password" required className="form-input" />

          <button
            type="submit"
            className="btn btn-primary"
            style={{width: '100%', marginTop: '0.5rem'}}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
            Already have an account? <Link href="/auth/signin" style={{color: 'var(--accent-color)'}}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
