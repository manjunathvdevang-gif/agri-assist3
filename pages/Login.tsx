
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Phone, Lock, ArrowRight, ChevronLeft, LogOut } from 'lucide-react';
import { UserRole } from '../types';

interface Props {
  role: UserRole;
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ role, onLogin }) => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10 && pin.length >= 4) {
      onLogin();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/welcome')} 
          className="text-red-500 p-2 hover:bg-red-50 rounded-full flex items-center gap-1 transition-colors"
          title="Return to Welcome"
        >
          <LogOut size={22} />
          <span className="text-[10px] font-black uppercase">Logout</span>
        </button>
        <div className="text-[10px] font-black uppercase text-gray-400">
          Selected: <span className="text-green-600">{role || 'None'}</span>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="bg-green-600 p-4 rounded-[1.5rem] shadow-lg mb-4">
          <Leaf size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-1">Agri Assist</h1>
        <p className="text-gray-500 text-sm">Grow Smarter, Sell Better.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex-1 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Mobile Number</label>
            <div className="flex items-center gap-3 border rounded-2xl px-4 py-4 focus-within:border-green-500 transition-colors">
              <div className="flex items-center gap-2 text-gray-400 border-r pr-3">
                <Phone size={18} />
                <span className="text-sm font-semibold">+91</span>
              </div>
              <input 
                type="tel" 
                placeholder="98765 43210" 
                maxLength={10}
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                className="flex-1 bg-transparent outline-none text-sm font-medium" 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Security PIN</label>
            <div className="flex items-center gap-3 border rounded-2xl px-4 py-4 focus-within:border-green-500 transition-colors">
              <Lock size={18} className="text-gray-400" />
              <input 
                type="password" 
                placeholder="••••" 
                maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                className="flex-1 bg-transparent outline-none text-sm font-medium tracking-[0.5em]" 
              />
            </div>
            <button type="button" className="w-full text-right mt-3 text-xs font-bold text-green-600">Forgot PIN?</button>
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-xl shadow-green-200 mt-4 active:scale-[0.98] transition-all"
          >
            Login Securely <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-auto text-center pt-8">
          <p className="text-sm text-gray-400">
            Don't have an account? <button className="text-green-600 font-bold">Sign Up</button>
          </p>
          <p className="text-[10px] text-gray-400 mt-4 leading-relaxed">
            By logging in, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
