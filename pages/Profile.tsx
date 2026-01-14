import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, User, Edit2, MapPin, 
  BookOpen, History, Settings, 
  ChevronRight, Sparkles, X, Save, Info,
  Package, CreditCard, HelpCircle, Phone, Mail, MessageCircle
} from 'lucide-react';
import { UserRole } from '../types';

interface Props {
  role: UserRole;
}

const Profile: React.FC<Props> = ({ role }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [reportText, setReportText] = useState('');
  
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    location: 'Mysuru, Karnataka',
    landArea: '5.2 Acres',
    primaryCrop: 'Rice',
    mobile: '98450 12345'
  });

  const [tempProfile, setTempProfile] = useState({...profile});

  const handleSave = () => {
    setProfile({...tempProfile});
    setIsEditing(false);
  };

  const handleReportSubmit = () => {
    if (reportText.trim()) {
      alert("Thank you! Your issue has been reported to our support team.");
      setReportText('');
      setActiveMenu(null);
    }
  };

  const menuItems = [
    { icon: BookOpen, label: 'My Orders / History', key: 'history', color: 'blue' },
    { icon: History, label: 'Payment Settings', key: 'payments', color: 'green' },
    { icon: HelpCircle, label: 'Help & Support', key: 'help', color: 'orange' },
    { icon: Settings, label: 'App Settings', key: 'settings', color: 'gray' }
  ];

  return (
    <div className="pb-24 relative min-h-screen bg-white">
      <div className="bg-white px-6 py-5 flex items-center gap-4 sticky top-0 z-20 border-b">
        <ChevronLeft size={24} className="text-gray-600 cursor-pointer" onClick={() => navigate('/')} />
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-1 rounded-full"><User size={16} className="text-green-600" /></div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">My Profile</h1>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Profile Card */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
          
          <button 
            onClick={() => { setTempProfile({...profile}); setIsEditing(true); }}
            className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-green-600 transition-all"
          >
            <Edit2 size={16} />
          </button>
          
          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
              <User size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">{profile.name}</h2>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">
              {role === 'farmer' ? `Farmer ID: #AGRI-8821` : `Consumer Account`}
            </p>
            <div className="flex flex-col items-center mt-2 space-y-1">
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                <MapPin size={10} /> {profile.location}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                <Phone size={10} /> {profile.mobile}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                {role === 'farmer' ? 'Land Area' : 'Loyalty Points'}
              </p>
              <p className="text-lg font-black text-gray-900">{role === 'farmer' ? profile.landArea : '240 Pts'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                {role === 'farmer' ? 'Primary Crop' : 'Orders'}
              </p>
              <p className="text-lg font-black text-gray-900">{role === 'farmer' ? profile.primaryCrop : '12'}</p>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-4 shadow-sm divide-y divide-gray-50">
          {menuItems.map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveMenu(item.key)}
              className="w-full flex items-center justify-between py-5 px-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-gray-50 text-gray-500">
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Menu Modals */}
      {activeMenu && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end">
          <div className="bg-white w-full rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300 min-h-[60vh] max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">{menuItems.find(m => m.key === activeMenu)?.label}</h2>
              <button onClick={() => setActiveMenu(null)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            </div>
            
            {activeMenu === 'help' ? (
              <div className="space-y-8 pb-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><Info size={18} /> Frequently Asked Questions</h3>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <p className="font-bold text-sm text-gray-800 mb-2">How do I update my location?</p>
                    <p className="text-xs text-gray-500 leading-relaxed">Go to the Dashboard (Home) and tap on your current location name at the top right to search and select a new one.</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <p className="font-bold text-sm text-gray-800 mb-2">How to contact a buyer/farmer?</p>
                    <p className="text-xs text-gray-500 leading-relaxed">In the Marketplace tab, click the "Contact" button on any listing to view their verified phone number and details.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><Phone size={18} /> Contact Us</h3>
                  <div className="flex gap-4">
                     <a href="tel:18001234567" className="flex-1 bg-green-50 text-green-700 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-xs border border-green-100 hover:bg-green-100 transition-colors">
                       <Phone size={24} /> Call Support
                     </a>
                     <a href="mailto:help@agriassist.com" className="flex-1 bg-blue-50 text-blue-700 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-xs border border-blue-100 hover:bg-blue-100 transition-colors">
                       <Mail size={24} /> Email Us
                     </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><MessageCircle size={18} /> Report an Issue</h3>
                  <div className="bg-gray-50 p-2 rounded-3xl border focus-within:border-red-300 focus-within:bg-white transition-all">
                    <textarea 
                      className="w-full bg-transparent p-4 text-sm font-medium outline-none resize-none"
                      placeholder="Describe the issue you are facing..."
                      rows={4}
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                    ></textarea>
                  </div>
                  <button onClick={handleReportSubmit} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl text-sm shadow-lg active:scale-95 transition-all">
                    Submit Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="bg-gray-50 p-6 rounded-full">
                  {activeMenu === 'history' && <Package size={48} className="text-blue-500" />}
                  {activeMenu === 'payments' && <CreditCard size={48} className="text-green-500" />}
                  {activeMenu === 'settings' && <Settings size={48} className="text-gray-500" />}
                </div>
                <p className="text-gray-500 font-bold max-w-xs">This feature is coming soon in the next update!</p>
                <button 
                  onClick={() => setActiveMenu(null)}
                  className="bg-green-600 text-white font-black px-8 py-3 rounded-2xl"
                >
                  Got it
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end">
          <div className="bg-white w-full rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={tempProfile.name}
                  onChange={e => setTempProfile({...tempProfile, name: e.target.value})}
                  className="w-full bg-gray-50 border-2 p-4 rounded-2xl font-bold focus:border-green-400 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                <input 
                  type="text" 
                  value={tempProfile.mobile}
                  onChange={e => setTempProfile({...tempProfile, mobile: e.target.value})}
                  className="w-full bg-gray-50 border-2 p-4 rounded-2xl font-bold focus:border-green-400 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                <input 
                  type="text" 
                  value={tempProfile.location}
                  onChange={e => setTempProfile({...tempProfile, location: e.target.value})}
                  className="w-full bg-gray-50 border-2 p-4 rounded-2xl font-bold focus:border-green-400 outline-none"
                />
              </div>

              {role === 'farmer' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Land Size</label>
                    <input 
                      type="text" 
                      value={tempProfile.landArea}
                      onChange={e => setTempProfile({...tempProfile, landArea: e.target.value})}
                      className="w-full bg-gray-50 border-2 p-4 rounded-2xl font-bold focus:border-green-400 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Main Crop</label>
                    <input 
                      type="text" 
                      value={tempProfile.primaryCrop}
                      onChange={e => setTempProfile({...tempProfile, primaryCrop: e.target.value})}
                      className="w-full bg-gray-50 border-2 p-4 rounded-2xl font-bold focus:border-green-400 outline-none"
                    />
                  </div>
                </div>
              )}
              
              <button 
                onClick={handleSave}
                className="w-full bg-green-600 text-white font-black py-5 rounded-3xl shadow-xl flex items-center justify-center gap-2 text-lg active:scale-95 transition-all mt-4"
              >
                <Save size={20} /> Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agri Assistant Access */}
      <button 
        onClick={() => navigate('/assistant')}
        className="fixed bottom-24 right-6 bg-green-500 p-4 rounded-full shadow-2xl text-white z-50 flex items-center justify-center animate-bounce"
      >
        <Sparkles size={28} />
      </button>
    </div>
  );
};

export default Profile;