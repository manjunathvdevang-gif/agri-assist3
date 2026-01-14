
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudSun, Droplets, Wind, Sun, ArrowUpRight, 
  MapPin, User, TrendingUp, Sprout, Navigation, 
  LogOut, Beaker, FileText, Loader2, X, ChevronLeft, Volume2,
  Bell, ArrowRight, Activity, Sparkles, AlertTriangle, Bug, ShieldCheck, ChevronRight, Search, Calendar, Info
} from 'lucide-react';
import { analyzeSoilData, generateSpeech, decodeBase64, decodePCM, getWeatherDetails } from '../services/geminiService';
import { ALL_LOCATIONS, MOCK_CROPS } from '../constants';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Mysuru, KA");
  const [isEditingLoc, setIsEditingLoc] = useState(false);
  const [locSearch, setLocSearch] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [soilResult, setSoilResult] = useState<string | null>(null);
  const [showSoilForm, setShowSoilForm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPest, setSelectedPest] = useState<any>(null);
  const [dashboardSearch, setDashboardSearch] = useState('');
  
  // Weather States
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<string[]>([]);
  const [farmingAdvisory, setFarmingAdvisory] = useState<string>("");
  const [loadingWeather, setLoadingWeather] = useState(false);

  const [soilData, setSoilData] = useState({
    ph: '6.8', n: 'Medium', p: 'Low', k: 'Medium', moisture: '30'
  });

  // Filtered locations for the search
  const filteredLocations = useMemo(() => {
    return ALL_LOCATIONS.filter(loc => 
      loc.toLowerCase().includes(locSearch.toLowerCase())
    );
  }, [locSearch]);

  // Fetch Weather on Location Change
  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingWeather(true);
      const data = await getWeatherDetails(location);
      if (data) {
        setWeather(data.current);
        setWeatherAlerts(data.alerts || []);
        setFarmingAdvisory(data.advisory || "");
        setForecast(data.forecast || []);
      } else {
        // Fallback for demo if API fails
        setWeather({ temp: "28", condition: "Sunny", humidity: "65", wind: "12", uv: "High" });
        setWeatherAlerts([]);
        setFarmingAdvisory("Weather conditions are stable for general farming activities.");
        setForecast([]);
      }
      setLoadingWeather(false);
    };

    fetchWeather();
  }, [location]);

  // Mock Pest Data based on region
  const pestAlerts = useMemo(() => {
    const commonPests = [
      {
        id: 'p1',
        crop: 'Rice',
        pest: 'Stem Borer',
        risk: 'High',
        symptoms: 'Dead hearts in young plants, white heads in older ones.',
        prevention: 'Maintain proper water levels. Use light traps.',
        treatment: 'Apply Neem cake to soil. Spray Pheromone traps.',
        locations: ['Mysuru, KA', 'Mandya, KA', 'Raichur, KA']
      },
      {
        id: 'p2',
        crop: 'Maize',
        pest: 'Fall Armyworm',
        risk: 'Moderate',
        symptoms: 'Ragged holes in leaves, sawdust-like waste in whorls.',
        prevention: 'Early sowing. Intercropping with legumes.',
        treatment: 'Spray Metarhizium anisopliae or Beauveria bassiana.',
        locations: ['Davanagere, KA', 'Haveri, KA', 'Hassan, KA']
      },
      {
        id: 'p3',
        crop: 'Tomato',
        pest: 'Early Blight',
        risk: 'High',
        symptoms: 'Target-like brown spots on older leaves.',
        prevention: 'Crop rotation. Avoid overhead irrigation.',
        treatment: 'Apply Trichoderma viride. Use copper-based fungicides.',
        locations: ['Kolar, KA', 'Chikballapur, KA', 'Mysuru, KA']
      }
    ];
    return commonPests.filter(p => p.locations.includes(location) || Math.random() > 0.5).slice(0, 2);
  }, [location]);

  const filteredPests = useMemo(() => {
    if (!dashboardSearch) return pestAlerts;
    return pestAlerts.filter(p => 
      p.pest.toLowerCase().includes(dashboardSearch.toLowerCase()) || 
      p.crop.toLowerCase().includes(dashboardSearch.toLowerCase())
    );
  }, [pestAlerts, dashboardSearch]);

  const filteredMarketCrops = useMemo(() => {
    if (!dashboardSearch) return MOCK_CROPS.slice(0, 1);
    return MOCK_CROPS.filter(c => c.name.toLowerCase().includes(dashboardSearch.toLowerCase()));
  }, [dashboardSearch]);

  const handleLocChange = (newLoc: string) => {
    setLocation(newLoc);
    setIsEditingLoc(false);
    setLocSearch('');
  };

  const handleLogout = () => {
    window.location.href = '#/welcome';
    window.location.reload();
  };

  const runSoilAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    const result = await analyzeSoilData(soilData);
    setSoilResult(result || "Analysis failed.");
    setIsAnalyzing(false);
    setShowSoilForm(false);
    if (result) speakText(result);
  };

  const speakText = async (text: string) => {
    setIsPlaying(true);
    const audioData = await generateSpeech(text, 'en');
    if (audioData) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = await decodePCM(decodeBase64(audioData), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
      } catch (e) {
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-white sticky top-0 z-20 border-b">
        <button 
          onClick={handleLogout} 
          className="text-red-500 p-2 hover:bg-red-50 rounded-full flex items-center gap-1 transition-colors"
          title="Logout"
        >
          <LogOut size={22} />
          <span className="text-[10px] font-black uppercase">Logout</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <LeafIcon className="text-green-600 w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">AgriAssist</h1>
        </div>
        <button onClick={() => navigate('/profile')} className="text-gray-400 p-2 hover:bg-gray-100 rounded-full">
          <UserCircleIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 space-y-6 pt-4">
        {/* Prominent Search Bar */}
        <div className="bg-white border-2 border-green-200 rounded-[1.5rem] px-5 py-5 flex items-center gap-3 shadow-lg focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-100 transition-all transform hover:scale-[1.01]">
          <Search size={24} className="text-green-600" />
          <input 
            type="text" 
            placeholder="Search for crops, pests, or market rates..." 
            className="bg-transparent outline-none text-lg w-full font-bold text-gray-800 placeholder-gray-400"
            value={dashboardSearch}
            onChange={(e) => setDashboardSearch(e.target.value)}
          />
          {dashboardSearch && <button onClick={() => setDashboardSearch('')}><X size={20} className="text-gray-400 hover:text-red-500" /></button>}
        </div>

        {/* Proactive Weather Alerts Section */}
        {weatherAlerts.length > 0 && !dashboardSearch && (
           <div className="bg-red-50 border border-red-100 rounded-[2rem] p-5 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex items-center gap-3 mb-3">
               <div className="bg-red-100 p-2 rounded-full text-red-600 animate-pulse">
                 <AlertTriangle size={20} />
               </div>
               <h3 className="font-black text-red-700 uppercase tracking-widest text-xs">Farm Weather Alert</h3>
             </div>
             <div className="space-y-2">
               {weatherAlerts.map((alert, idx) => (
                 <div key={idx} className="flex items-start gap-2">
                    <div className="min-w-1.5 h-1.5 rounded-full bg-red-400 mt-2"></div>
                    <p className="text-sm font-bold text-gray-800 leading-snug">{alert}</p>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* Farming Advisory Section */}
        {!dashboardSearch && farmingAdvisory && (
            <div className="bg-blue-50 border border-blue-100 rounded-[1.5rem] p-5 shadow-sm flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="text-xs font-black text-blue-700 uppercase tracking-widest mb-1">Today's Farming Advisory</h3>
                    <p className="text-sm font-bold text-gray-800 leading-snug">{farmingAdvisory}</p>
                </div>
            </div>
        )}

        {/* Weather Card (Live) */}
        {!dashboardSearch && (
          <div className="bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm relative overflow-hidden">
            {loadingWeather && (
               <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                 <Loader2 size={32} className="animate-spin text-green-600" />
               </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-gray-800">
                <CloudSun size={20} className="text-blue-500" />
                <span className="font-bold">Live Weather</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span> Live
                </span>
                <button onClick={() => setIsEditingLoc(true)} className="text-[10px] font-black text-gray-400 flex items-center gap-1 hover:text-green-600">
                  <Navigation size={10} /> {location}
                </button>
              </div>
            </div>

            {weather && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-5xl font-black text-gray-900 tracking-tighter">{weather.temp}°C</p>
                    <p className="text-sm text-gray-500 font-medium mt-1">{weather.condition}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 bg-gray-50 p-2 rounded-xl min-w-[3.5rem]">
                      <Droplets size={16} className="text-blue-400" />
                      <span className="text-[10px] font-bold text-gray-600">{weather.humidity}%</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 bg-gray-50 p-2 rounded-xl min-w-[3.5rem]">
                      <Wind size={16} className="text-orange-400" />
                      <span className="text-[10px] font-bold text-gray-600">{weather.wind}kph</span>
                    </div>
                  </div>
                </div>

                {/* 3-Day Forecast */}
                {forecast.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                      <Calendar size={12} /> Forecast
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {forecast.map((day: any, i) => (
                        <div key={i} className="text-center bg-gray-50 rounded-xl p-2">
                          <p className="text-[10px] font-bold text-gray-500 mb-1">{day.day}</p>
                          <p className="text-sm font-black text-gray-800">{day.temp}°</p>
                          <p className="text-[9px] text-gray-400 truncate">{day.condition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Hero Card - Soil Analysis (Hide when searching) */}
        {!dashboardSearch && (
          <div className="relative overflow-hidden bg-gradient-to-br from-[#108A4E] to-[#0A6B3D] rounded-[2rem] p-8 text-white shadow-xl">
            <div className="relative z-10 max-w-[65%]">
              <span className="bg-white/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">AI Powered</span>
              <h2 className="text-2xl font-bold mt-3 mb-2">Best Crop for Your Soil</h2>
              <p className="text-xs text-white/80 leading-relaxed mb-6 font-medium">
                Get personalized crop suggestions based on your soil type, season, and local weather.
              </p>
              <button 
                onClick={() => setShowSoilForm(true)}
                className="bg-white text-[#108A4E] px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all active:scale-95"
              >
                Check Now <ArrowRight size={16} />
              </button>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-20 pointer-events-none">
              <Sprout size={180} />
            </div>
          </div>
        )}

        {/* Market Rates Card */}
        {(filteredMarketCrops.length > 0 || !dashboardSearch) && (
          <div className="bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-green-600" />
                <span className="font-bold text-gray-800">Market Rates {dashboardSearch && `(${filteredMarketCrops.length})`}</span>
              </div>
              <button onClick={() => navigate('/market')} className="text-xs font-bold text-green-600">View All</button>
            </div>

            <div className="space-y-4">
              {filteredMarketCrops.map(crop => (
                <div key={crop.id} className="relative">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{crop.name}</h3>
                      <p className="text-[10px] text-gray-400 font-medium">Mandi: {crop.mandi}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900">₹{crop.price.toLocaleString()}/{crop.unit}</p>
                      <p className="text-[10px] font-bold text-green-600 flex items-center justify-end gap-0.5">
                        <ArrowUpRight size={10} /> {crop.change}
                      </p>
                    </div>
                  </div>
                  {!dashboardSearch && (
                    <div className="mt-4 h-16 w-full bg-gradient-to-t from-green-50 to-transparent rounded-lg relative overflow-hidden">
                       <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                          <path d="M0,20 Q25,10 50,15 T100,2" fill="none" stroke="#108A4E" strokeWidth="1" />
                       </svg>
                    </div>
                  )}
                  {dashboardSearch && <div className="h-px bg-gray-100 mt-3" />}
                </div>
              ))}
              {filteredMarketCrops.length === 0 && dashboardSearch && (
                 <p className="text-gray-400 text-sm text-center py-2">No market rates found for "{dashboardSearch}"</p>
              )}
            </div>
          </div>
        )}

        {/* Pest Alerts Section */}
        {(filteredPests.length > 0 || !dashboardSearch) && (
          <div className="bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Bug size={20} className="text-orange-600" />
                <span className="font-bold text-gray-800">Pest Alerts</span>
              </div>
              <div className="bg-orange-50 px-2 py-1 rounded text-[10px] font-black text-orange-600 uppercase tracking-tighter">Region Specific</div>
            </div>

            <div className="space-y-3">
              {filteredPests.length > 0 ? filteredPests.map(pest => (
                <button 
                  key={pest.id} 
                  onClick={() => setSelectedPest(pest)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-orange-200 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${pest.risk === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{pest.pest}</h4>
                      <p className="text-[10px] text-gray-500 font-medium">Affecting: <span className="text-gray-700 font-bold">{pest.crop}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${pest.risk === 'High' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                      {pest.risk} Risk
                    </span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>
              )) : (
                 <p className="text-gray-400 text-sm text-center py-2">No pest alerts found for "{dashboardSearch}"</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Manual Soil Data Modal */}
      {showSoilForm && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-md flex items-end sm:items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-200 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Soil Manual Entry</h3>
              <button onClick={() => setShowSoilForm(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={runSoilAnalysis} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">pH Level</label>
                  <input type="number" step="0.1" value={soilData.ph} onChange={e => setSoilData({...soilData, ph: e.target.value})} className="w-full bg-gray-50 border-2 p-4 rounded-xl font-bold focus:border-green-400 outline-none" placeholder="6.5" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Moisture %</label>
                  <input type="number" value={soilData.moisture} onChange={e => setSoilData({...soilData, moisture: e.target.value})} className="w-full bg-gray-50 border-2 p-4 rounded-xl font-bold focus:border-green-400 outline-none" placeholder="30" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nitrogen (Hydrogen Level)</label>
                <select value={soilData.n} onChange={e => setSoilData({...soilData, n: e.target.value})} className="w-full bg-gray-50 border-2 p-4 rounded-xl font-bold focus:border-green-400 outline-none">
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phosphorus (P)</label>
                  <select value={soilData.p} onChange={e => setSoilData({...soilData, p: e.target.value})} className="w-full bg-gray-50 border-2 p-4 rounded-xl font-bold focus:border-green-400 outline-none">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Potassium (K)</label>
                  <select value={soilData.k} onChange={e => setSoilData({...soilData, k: e.target.value})} className="w-full bg-gray-50 border-2 p-4 rounded-xl font-bold focus:border-green-400 outline-none">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                disabled={isAnalyzing}
                className="w-full bg-green-600 text-white font-black py-5 rounded-3xl shadow-xl mt-4 flex justify-center items-center gap-2 active:scale-[0.98] transition-all"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" /> : <Beaker size={20} />}
                {isAnalyzing ? "Processing..." : "Find Best Crops"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pest Detail Modal */}
      {selectedPest && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-end">
          <div className="bg-white w-full rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600"><Bug size={24} /></div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">{selectedPest.pest}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target: {selectedPest.crop}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPest(null)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            </div>

            <div className="space-y-6 pb-10">
              <section className="bg-red-50 p-6 rounded-3xl border border-red-100">
                <h4 className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <AlertTriangle size={12} /> Key Symptoms
                </h4>
                <p className="text-sm font-bold text-gray-700 leading-relaxed">{selectedPest.symptoms}</p>
              </section>

              <div className="grid grid-cols-1 gap-4">
                <section className="bg-green-50 p-6 rounded-3xl border border-green-100">
                  <h4 className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShieldCheck size={12} /> Prevention
                  </h4>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed">{selectedPest.prevention}</p>
                </section>
                <section className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Sprout size={12} /> Treatment Advice
                  </h4>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed">{selectedPest.treatment}</p>
                </section>
              </div>

              <button 
                onClick={() => {
                  const query = `Tell me more about ${selectedPest.pest} attacking my ${selectedPest.crop} and how to organiclly treat it.`;
                  navigate('/assistant', { state: { initialQuery: query } });
                }}
                className="w-full bg-green-600 text-white font-black py-5 rounded-3xl shadow-xl flex items-center justify-center gap-2 active:scale-[0.95] transition-all"
              >
                <Sparkles size={18} /> Ask AI Expert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Soil Result Display */}
      {soilResult && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end p-4">
           <div className="bg-white w-full rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black">AI Recommendation</h3>
                <div className="flex gap-2">
                  <button onClick={() => speakText(soilResult)} className={`p-2 rounded-full ${isPlaying ? 'bg-green-600 text-white animate-pulse' : 'bg-gray-100 text-green-600'}`}>
                    <Volume2 size={20} />
                  </button>
                  <button onClick={() => setSoilResult(null)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-line max-h-[50vh] overflow-y-auto no-scrollbar pb-6">
                {soilResult}
              </div>
           </div>
        </div>
      )}

      {/* Location Modal */}
      {isEditingLoc && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-md flex items-end">
          <div className="bg-white w-full rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300 h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Select Your Region</h3>
              <button onClick={() => { setIsEditingLoc(false); setLocSearch(''); }} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
            </div>
            
            {/* Location Search Bar */}
            <div className="mb-4 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search for your city or village..."
                value={locSearch}
                onChange={(e) => setLocSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-green-400 focus:bg-white transition-all shadow-inner"
              />
              {locSearch && (
                <button onClick={() => setLocSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 bg-white rounded-full p-1">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="space-y-2 overflow-y-auto no-scrollbar flex-1 pb-10">
              {filteredLocations.length > 0 ? filteredLocations.map(city => (
                <button 
                  key={city}
                  onClick={() => handleLocChange(city)}
                  className={`w-full py-4 rounded-2xl font-bold border text-left px-6 transition-all flex justify-between items-center ${
                    location === city ? 'bg-green-600 text-white border-green-600 shadow-lg' : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {city}
                  {location === city && <MapPin size={16} />}
                </button>
              )) : (
                <div className="py-20 flex flex-col items-center text-center px-6">
                   <div className="bg-gray-50 p-6 rounded-full mb-4">
                     <MapPin size={40} className="text-gray-200" />
                   </div>
                   <p className="text-gray-500 font-bold">No locations found for "{locSearch}"</p>
                   <p className="text-xs text-gray-400 mt-2">Try searching with a different name or spelling.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/assistant')}
        className="fixed bottom-24 right-6 bg-green-500 p-4 rounded-full shadow-2xl text-white z-50 flex items-center justify-center animate-bounce"
      >
        <Sparkles size={28} />
      </button>
    </div>
  );
};

const LeafIcon = ({ className }: any) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
  </svg>
);

const UserCircleIcon = ({ className }: any) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

export default Dashboard;
