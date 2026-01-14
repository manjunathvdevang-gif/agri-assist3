
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-green-600 flex flex-col items-center justify-between text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-20%] w-[100%] h-[50%] bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center pt-10">
        <div className="bg-white/20 p-6 rounded-[2rem] shadow-xl backdrop-blur-sm mb-6">
          <Leaf size={64} className="text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-2">Agri Assist</h1>
        <p className="text-lg opacity-90 font-medium">Smart Farming for a Better Future</p>
      </div>

      <div className="w-full px-6 pb-12 z-10">
        <div className="bg-white text-gray-900 rounded-[2.5rem] p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Access real-time market rates, expert crop advice, and direct buyer connections—all in one place to help you grow better.
          </p>
          <button 
            onClick={() => navigate('/role')}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-lg hover:bg-green-700 active:scale-[0.98] transition-all"
          >
            Get Started <ArrowRight size={20} />
          </button>
        </div>
        <p className="text-center mt-6 text-[10px] uppercase tracking-widest font-bold opacity-60">
          Trusted by 10K+ Farmers
        </p>
      </div>
    </div>
  );
};

export default Welcome;
