
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Sprout, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';

interface Props {
  onSelect: (role: UserRole) => void;
}

const RoleSelection: React.FC<Props> = ({ onSelect }) => {
  const navigate = useNavigate();

  const handleSelect = (role: UserRole) => {
    onSelect(role);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white shadow-sm border rounded-full flex items-center justify-center mb-10">
        <ChevronLeft size={20} />
      </button>

      <div className="flex flex-col items-center mb-12">
        <div className="bg-green-50 p-4 rounded-2xl mb-4">
          <Sprout size={40} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Agri Assist</h1>
        <p className="text-gray-500 text-center">Smart Farming & Direct Marketplace</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => handleSelect('farmer')}
          className="w-full bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-300 transition-all text-left active:scale-[0.98]"
        >
          <div className="bg-green-100 p-4 rounded-2xl">
            <Sprout size={32} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">I am a Farmer</h3>
            <p className="text-sm text-gray-500">Manage crops, get advice & sell produce.</p>
          </div>
          <ArrowRight size={20} className="text-gray-300" />
        </button>

        <button 
          onClick={() => handleSelect('consumer')}
          className="w-full bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 hover:border-orange-300 transition-all text-left active:scale-[0.98]"
        >
          <div className="bg-orange-50 p-4 rounded-2xl">
            <ShoppingBag size={32} className="text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">I am a Consumer</h3>
            <p className="text-sm text-gray-500">Buy fresh vegetables & fruits directly.</p>
          </div>
          <ArrowRight size={20} className="text-gray-300" />
        </button>
      </div>

      <p className="mt-auto text-center text-xs text-gray-400">Select your role to continue</p>
    </div>
  );
};

export default RoleSelection;
