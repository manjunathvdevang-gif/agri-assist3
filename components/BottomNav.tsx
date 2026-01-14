
import React from 'react';
import { Home, ShoppingBag, BookOpen, User, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../types';

interface Props {
  role: UserRole;
}

const BottomNav: React.FC<Props> = ({ role }) => {
  const location = useLocation();

  const farmerItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/market', icon: ShoppingBag, label: 'Market' },
    { path: '/guide', icon: BookOpen, label: 'Guide' },
    { path: '/assistant', icon: MessageSquare, label: 'Sahayak' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const consumerItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const navItems = role === 'consumer' ? consumerItems : farmerItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-around items-center safe-area-bottom z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full py-1.5 transition-all ${
              isActive ? 'text-green-600' : 'text-gray-300'
            }`}
          >
            <div className={`relative ${isActive ? 'scale-110' : ''}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] mt-1 font-black ${isActive ? 'text-green-600' : 'text-gray-400'} uppercase tracking-tighter`}>
              {item.label}
            </span>
            {isActive && <div className="w-1 h-1 bg-green-600 rounded-full mt-0.5"></div>}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
