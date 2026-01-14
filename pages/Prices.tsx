
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ArrowUpRight, ArrowDownRight, Minus, Info, 
  Bell, Plus, Trash2, BellRing, TrendingUp, TrendingDown, X, CheckCircle2 
} from 'lucide-react';
import { MOCK_CROPS, ALL_CROP_NAMES } from '../constants';

interface PriceAlert {
  id: string;
  cropName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
}

const Prices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mandi' | 'msp' | 'alerts'>('mandi');
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Alert State
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('agri_price_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [newAlert, setNewAlert] = useState<{crop: string, price: string, condition: 'above' | 'below'}>({
    crop: ALL_CROP_NAMES[0],
    price: '',
    condition: 'above'
  });

  useEffect(() => {
    localStorage.setItem('agri_price_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.price) return;

    const alert: PriceAlert = {
      id: Date.now().toString(),
      cropName: newAlert.crop,
      targetPrice: Number(newAlert.price),
      condition: newAlert.condition,
      createdAt: new Date().toLocaleDateString()
    };

    setAlerts([alert, ...alerts]);
    setShowAddAlert(false);
    setNewAlert({ crop: ALL_CROP_NAMES[0], price: '', condition: 'above' });
    setActiveTab('alerts');
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const getPriceStatus = (alert: PriceAlert) => {
    const marketData = MOCK_CROPS.find(c => c.name === alert.cropName);
    const currentPrice = marketData ? marketData.price : 0;
    
    let isTriggered = false;
    if (alert.condition === 'above' && currentPrice >= alert.targetPrice) isTriggered = true;
    if (alert.condition === 'below' && currentPrice <= alert.targetPrice) isTriggered = true;

    return { isTriggered, currentPrice };
  };

  const filteredMandiCrops = MOCK_CROPS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm">
        <div className="flex justify-between items-center mb-4">
           <h1 className="text-xl font-bold text-gray-800">Market Pricing</h1>
           {activeTab === 'alerts' && (
             <button 
               onClick={() => setShowAddAlert(true)}
               className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
             >
               <Plus size={14} /> New Alert
             </button>
           )}
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
          <button 
            onClick={() => setActiveTab('mandi')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'mandi' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'
            }`}
          >
            Mandi Rates
          </button>
          <button 
            onClick={() => setActiveTab('msp')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'msp' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'
            }`}
          >
            Govt MSP
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'alerts' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'
            }`}
          >
            <Bell size={14} className={activeTab === 'alerts' ? 'fill-current' : ''} /> My Alerts
          </button>
        </div>

        {activeTab !== 'alerts' && (
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-100 rounded-lg p-2 flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search crop..." 
                className="bg-transparent outline-none text-sm w-full font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-gray-100 p-2 rounded-lg text-gray-600"><Filter size={20} /></button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'mandi' && (
          <>
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex gap-3">
              <Info className="text-blue-500 shrink-0" size={20} />
              <p className="text-[11px] text-blue-700 font-medium leading-relaxed">Prices are updated every hour from 30+ mandis in your region. Last update: 10:30 AM.</p>
            </div>
            {filteredMandiCrops.map((crop) => (
              <div key={crop.id} className="bg-white border rounded-[1.5rem] p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{crop.name}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{crop.mandi}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${
                    crop.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {crop.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {crop.change}
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Current Price</p>
                    <p className="text-3xl font-black text-gray-900">₹{crop.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Today's Range</p>
                    <p className="text-sm font-bold text-gray-600">₹{crop.price - 100} - ₹{crop.price + 150}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'msp' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 px-1 uppercase tracking-widest">2024-25 Kharif Season MSP</h2>
            {MOCK_CROPS.filter(c => c.msp).map((crop) => (
              <div key={crop.id} className="bg-white border rounded-[1.5rem] p-5 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl uppercase tracking-wider">Guaranteed</div>
                <h3 className="font-bold text-lg text-gray-900">{crop.name}</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Govt MSP</p>
                    <p className="text-xl font-bold text-green-700">₹{crop.msp}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Profit Margin</p>
                    <p className="text-xl font-bold text-blue-700">~₹{(crop.msp || 0) * 0.5}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                 <div className="bg-gray-100 p-6 rounded-full mb-4">
                   <BellRing size={40} className="text-gray-300" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900">No Alerts Set</h3>
                 <p className="text-sm text-gray-400 max-w-[200px] mb-6">Get notified when crop prices hit your target.</p>
                 <button 
                  onClick={() => setShowAddAlert(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-all"
                 >
                   Create First Alert
                 </button>
              </div>
            ) : (
              alerts.map(alert => {
                const { isTriggered, currentPrice } = getPriceStatus(alert);
                return (
                  <div key={alert.id} className={`bg-white border rounded-[1.5rem] p-5 shadow-sm transition-all ${isTriggered ? 'border-orange-200 ring-2 ring-orange-100' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isTriggered ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                          <BellRing size={20} className={isTriggered ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{alert.cropName}</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Target: {alert.condition === 'above' ? '>' : '<'} ₹{alert.targetPrice}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => deleteAlert(alert.id)} className="text-gray-300 p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                       <div>
                         <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Current Rate</p>
                         <p className="text-lg font-black text-gray-800">₹{currentPrice}</p>
                       </div>
                       {isTriggered ? (
                         <div className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md">
                           <BellRing size={12} className="fill-current" /> Triggered
                         </div>
                       ) : (
                         <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                           <CheckCircle2 size={12} /> Active
                         </div>
                       )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Add Alert Modal */}
      {showAddAlert && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Set Price Alert</h3>
              <button onClick={() => setShowAddAlert(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddAlert} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Crop</label>
                <select 
                  value={newAlert.crop}
                  onChange={(e) => setNewAlert({...newAlert, crop: e.target.value})}
                  className="w-full bg-gray-50 border-2 p-4 rounded-2xl font-bold focus:border-green-400 outline-none text-gray-900"
                >
                  {ALL_CROP_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewAlert({...newAlert, condition: 'above'})}
                    className={`py-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      newAlert.condition === 'above' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 bg-white text-gray-500'
                    }`}
                  >
                    <TrendingUp size={16} /> Price Goes Above
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAlert({...newAlert, condition: 'below'})}
                    className={`py-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      newAlert.condition === 'below' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 bg-white text-gray-500'
                    }`}
                  >
                    <TrendingDown size={16} /> Price Goes Below
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Price (₹)</label>
                <input 
                  type="number" 
                  value={newAlert.price}
                  onChange={(e) => setNewAlert({...newAlert, price: e.target.value})}
                  placeholder="e.g., 2500"
                  className="w-full bg-gray-50 border-2 p-4 rounded-2xl font-bold focus:border-green-400 outline-none text-xl"
                  autoFocus
                />
              </div>

              <button 
                type="submit"
                disabled={!newAlert.price}
                className="w-full bg-green-600 disabled:bg-gray-300 text-white font-black py-4 rounded-2xl shadow-xl mt-4 flex justify-center items-center gap-2 active:scale-[0.98] transition-all"
              >
                <BellRing size={20} /> Set Alert
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prices;
