import React, { useState } from 'react';
import { useIdentity } from '../api/hooks/useIdentity';

interface AuthPageProps {

}

export const AuthPage: React.FC<AuthPageProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Pulling the compiled login mutation from your unified identity hook
  const { login } = useIdentity();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Just execute the request. If it fails, the interceptor layer handles the toast automatically!
    login.mutate(
      { email, password },
    );
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1e293b', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 style={{ color: '#ffffff', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>🐱 Blue Cat Studio</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Sign in to manage Shroomfall infrastructure</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px', outline: 'none' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px', outline: 'none' }} />
        </div>

        <button type="submit" disabled={login.isPending} style={{ marginTop: '10px', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: login.isPending ? '#3b82f6aa' : '#2563eb', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: login.isPending ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}>
          {login.isPending ? 'Authenticating...' : 'Connect to Server'}
        </button>
      </form>
    </div>
  );
};