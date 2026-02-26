import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Users,
  ShieldCheck,
  ServerCog,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const demoAccounts = [
    { label: 'Student', email: 'student@hack.io', role: 'student', icon: <User className="w-6 h-6" /> },
    { label: 'Faculty', email: 'faculty@hack.io', role: 'faculty', icon: <Users className="w-6 h-6" /> },
    { label: 'HOD', email: 'hod@hack.io', role: 'hod', icon: <ShieldCheck className="w-6 h-6" /> },
    { label: 'Admin', email: 'admin@hack.io', role: 'admin', icon: <ServerCog className="w-6 h-6" /> },
  ];

  const getRoleFromEmail = (emailAddress) => {
    if (emailAddress.includes('student')) return 'student';
    if (emailAddress.includes('faculty')) return 'faculty';
    if (emailAddress.includes('hod')) return 'hod';
    if (emailAddress.includes('admin')) return 'admin';
    return 'student';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      const role = getRoleFromEmail(email);
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);
      localStorage.setItem('userId', Math.random().toString(36).substr(2, 9));
      const routeMap = {
        student: '/student',
        faculty: '/faculty',
        hod: '/hod',
        admin: '/admin',
      };
      navigate(routeMap[role] || '/student');
      setIsLoading(false);
    }, 800);
  };

  const handleQuickLogin = (accountEmail, role) => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      localStorage.setItem('role', role);
      localStorage.setItem('email', accountEmail);
      localStorage.setItem('userId', Math.random().toString(36).substr(2, 9));
      const routeMap = {
        student: '/student',
        faculty: '/faculty',
        hod: '/hod',
        admin: '/admin',
      };
      navigate(routeMap[role] || '/student');
    }, 600);
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 ${
        mounted ? 'animate-fadeIn' : 'opacity-0'
      }`}
    >
      {/* custom animations */}
      <style>{`\n        @keyframes bgShift { 0% {background-position:0% 50%} 50% {background-position:100% 50%} 100% {background-position:0% 50%} }\n        @keyframes gridMove { from {background-position:0 0} to {background-position:50px 50px} }\n        @keyframes fadeIn { from {opacity:0} to {opacity:1} }\n        @keyframes pulseGlow { 0%,100% {opacity:0.3} 50% {opacity:0.6} }\n        .animate-bgShift { animation: bgShift 15s ease infinite; background-size: 200% 200%; }\n        .animate-gridMove { animation: gridMove 10s linear infinite; }\n        .animate-fadeIn { animation: fadeIn 1s ease forwards; }\n        .animate-pulseGlow { animation: pulseGlow 2s ease infinite; }\n      `}</style>

      {/* moving gradient layer */}
      <div className="absolute inset-0 animate-bgShift" style={{background: 'linear-gradient(220deg, #0e1a43, #01112f, #0b143e, #03112b)'}}></div>

      {/* grid overlay with movement */}
      <div className="absolute inset-0 opacity-20 animate-gridMove">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(0deg, transparent 24%, rgba(59,130,246,0.1) 25%, rgba(59,130,246,0.1) 26%, transparent 27%, transparent 74%, rgba(59,130,246,0.1) 75%, rgba(59,130,246,0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59,130,246,0.1) 25%, rgba(59,130,246,0.1) 26%, transparent 27%, transparent 74%, rgba(59,130,246,0.1) 75%, rgba(59,130,246,0.1) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* corner blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulseGlow"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-400 rounded-full filter blur-3xl opacity-20 animate-pulseGlow"></div>

      {/* glow behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-blue-500 rounded-full filter blur-4xl opacity-10 animate-pulseGlow"></div>
      </div>

      {/* main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl border border-transparent rounded-2xl shadow-xl p-8 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-300 p-4 rounded-xl animate-pulseGlow">
                  <Zap className="w-10 h-10 text-blue-950" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                HackTrack AI
              </h1>
              <p className="text-sm text-blue-200/70">
                Hackathon Management & Innovation Tracking
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* email field */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full py-3 px-4 bg-blue-950/50 border border-blue-500/30 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  placeholder="Email"
                />
                <label className="absolute left-4 top-3 text-blue-300 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-200">
                  Email Address
                </label>
                <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-400/50" />
              </div>

              {/* password field */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full py-3 px-4 bg-blue-950/50 border border-blue-500/30 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  placeholder="Password"
                />
                <label className="absolute left-4 top-3 text-blue-300 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-200">
                  Password
                </label>
                <Lock className="absolute left-3 top-3 w-5 h-5 text-blue-400/50" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-blue-400/50 hover:text-blue-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 rounded-lg relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">{isLoading ? 'Signing in...' : 'Sign In'}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-blue-500/20"></div>
              <span className="text-xs text-blue-300/50 uppercase tracking-widest">OR</span>
              <div className="flex-1 h-px bg-blue-500/20"></div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-blue-200/70 uppercase tracking-widest text-center">
                Quick Login - Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-4">
                {demoAccounts.map((account) => (
                  <button
                    key={account.role}
                    onClick={() => handleQuickLogin(account.email, account.role)}
                    disabled={isLoading}
                    className="group relative bg-white/10 backdrop-blur-lg border border-blue-500/20 rounded-xl p-4 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/40 disabled:opacity-70"
                  >
                    <div className="p-2 bg-blue-900/40 rounded-full">{account.icon}</div>
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-blue-200 group-hover:text-cyan-300 transition-colors text-sm">
                        {account.label}
                      </span>
                      <span className="text-xs text-blue-300/50 group-hover:text-blue-300/70 truncate">
                        {account.email}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center text-blue-200/50 text-xs">
            <p>Demo login for development purposes</p>
            <p className="mt-1">All demo accounts use any password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
