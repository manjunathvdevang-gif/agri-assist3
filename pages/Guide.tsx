
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Sprout, Droplets, Bug, Sparkles, ChevronLeft, X, BookOpen, Leaf } from 'lucide-react';
import { CropDetail } from '../types';

const Guide: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState<CropDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const crops: CropDetail[] = useMemo(() => [
    { 
      name: 'Rice (Paddy)', 
      image: '🌾',
      growing: 'Needs 20-35°C temp and standing water. Best sown in monsoon (Kharif). Needs regular irrigation.',
      fertilizers: 'Requires high Nitrogen (N) during tillering. Use Zinc if leaves turn brown or rust-like.',
      diseases: 'Blast, Blight, and Stem Borer are common. Maintain spacing and avoid excessive chemical N.',
      organic: 'Use Azolla and Blue Green Algae as bio-fertilizers. Neem oil sprays for early pest control.'
    },
    { 
      name: 'Wheat', 
      image: '🥖',
      growing: 'Rabi crop. Needs cool weather (10-25°C) and well-drained loamy soil. Requires 4-6 irrigations.',
      fertilizers: 'Urea and DAP application at first irrigation (21 days) is crucial for root development.',
      diseases: 'Rust (Yellow/Black) and Loose Smut are major threats. Always use certified resistant seeds.',
      organic: 'Jeevamrut application every 15 days improves soil carbon and moisture retention significantly.'
    },
    { 
      name: 'Tomato', 
      image: '🍅',
      growing: 'Needs sandy loam soil and warm nights. Sown in nursery first. Requires high organic matter.',
      fertilizers: 'Potassium is vital for fruit quality. Calcium prevents blossom end rot (fruit rot at base).',
      diseases: 'Early blight, Leaf Curl, and Wilt. Ensure proper staking and pruning for airflow.',
      organic: 'Fermented buttermilk spray acts as a powerful organic fungicide against most leaf blights.'
    },
    { 
      name: 'Cotton', 
      image: '☁️',
      growing: 'Thrives in black soil. Needs high heat and moderate rainfall. Long growing season required.',
      fertilizers: 'Deep rooted. Requires balanced NPK. Boron spray during flowering prevents boll shedding.',
      diseases: 'Pink Bollworm is the biggest threat. Wilting can occur in waterlogged soils.',
      organic: 'Yellow sticky traps and Pheromone traps effectively manage pest populations without toxins.'
    },
    { 
      name: 'Maize', 
      image: '🌽',
      growing: 'Highly adaptable. Needs well-drained soil and plenty of sun. Sensitive to waterlogging.',
      fertilizers: 'Heavy feeder. Needs consistent Nitrogen top-dressing at knee-high and tasseling stages.',
      diseases: 'Blight and Stem Borer. Downy mildew can affect young plants in humid conditions.',
      organic: 'Crop rotation with pulses naturally restores nitrogen for the next maize cycle.'
    },
    { 
      name: 'Potato', 
      image: '🥔',
      growing: 'Cool season crop. Requires loose, friable sandy loam soil. Earthing up is essential for tuber formation.',
      fertilizers: 'Heavy feeder of Potassium. Apply MOP during land preparation. Avoid excessive nitrogen to prevent hollow hearts.',
      diseases: 'Late Blight is the major killer in humid weather. Scab occurs in alkaline soils.',
      organic: 'Trichoderma soil application helps control soil-borne diseases. Use healthy certified seed tubers.'
    },
    { 
      name: 'Onion', 
      image: '🧅',
      growing: 'Cool weather for growth, dry for harvest. Needs loose soil for bulb expansion. Shallow rooted.',
      fertilizers: 'Sulphur is crucial for pungency and storage. Needs split application of Nitrogen.',
      diseases: 'Purple Blotch and Downy Mildew. Thrips cause "corkscrew" leaves.',
      organic: 'Neem cake application reduces soil nematodes. Sticky traps control thrips effectively.'
    },
    { 
      name: 'Sugarcane', 
      image: '🎋',
      growing: 'Long duration crop (10-12 months). Needs hot humid climate and massive water availability.',
      fertilizers: 'High Nitrogen requirement. Apply fertilizer in furrows. Micronutrients like Iron are vital.',
      diseases: 'Red Rot (cancer of sugarcane) causes alcoholic smell. Smut causes whip-like structures.',
      organic: 'Trash mulching conserves moisture and adds organic matter. Use biological control for borers.'
    },
    { 
      name: 'Chilli', 
      image: '🌶️',
      growing: 'Warm humid climate. Needs well-drained soil, cannot tolerate waterlogging. Sown in nursery.',
      fertilizers: 'Balanced NPK. Excess N causes flower drop. Calcium ensures firm fruit walls.',
      diseases: 'Leaf Curl Virus (transmitted by whitefly) and Anthracnose (fruit rot).',
      organic: 'Sour buttermilk spray controls viral vectors. Border cropping with maize reduces pest migration.'
    },
    { 
      name: 'Groundnut', 
      image: '🥜',
      growing: 'Warm season. Sandy loam is best for peg penetration. Avoid clay soils.',
      fertilizers: 'Gypsum (Calcium + Sulphur) application at flowering is critical for pod filling.',
      diseases: 'Tikka disease (leaf spot) and Rust. Aflatoxin contamination if stored damp.',
      organic: 'Seed treatment with Rhizobium increases nitrogen fixation naturally. Intercrop with pigeon pea.'
    }
  ], []);

  const filteredCrops = useMemo(() => {
    return crops.filter(crop => 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, crops]);

  return (
    <div className="pb-24 relative min-h-screen bg-white">
      <div className="bg-white px-6 py-5 flex items-center gap-4 sticky top-0 z-20 border-b">
        <button onClick={() => navigate('/')} className="text-gray-400 p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={24} /></button>
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-1 rounded-full"><Leaf size={16} className="text-green-600" /></div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Agri Sahayak</h1>
        </div>
      </div>

      <div className="p-5 space-y-8">
        <div className="bg-gray-50 border rounded-3xl px-5 py-4 flex items-center gap-3 focus-within:bg-white focus-within:border-green-300 transition-all">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search crops (e.g. Wheat, Rice)..." 
            className="bg-transparent outline-none text-sm w-full font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <button onClick={() => setSearchTerm('')}><X size={16} className="text-gray-300" /></button>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Knowledge Library</h2>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{filteredCrops.length} Crops</span>
          </div>
          
          <div className="space-y-4">
            {filteredCrops.length > 0 ? (
              filteredCrops.map((crop, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedCrop(crop)}
                  className="w-full bg-white border border-gray-100 rounded-[2rem] p-5 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all hover:border-green-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-gray-50">
                      {crop.image}
                    </div>
                    <div className="text-left">
                      <h3 className="font-black text-gray-900">{crop.name}</h3>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Full Expert Guide</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-300" />
                </button>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <Search size={40} className="text-gray-200" />
                </div>
                <p className="text-gray-400 font-bold">No crops match "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-2 text-green-600 font-bold text-sm">Clear Search</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-end">
          <div className="bg-white w-full h-[90vh] rounded-t-[3rem] overflow-y-auto no-scrollbar p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/90 backdrop-blur-md z-10 py-4 -mx-4 px-4 rounded-t-[3rem]">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedCrop.image}</span>
                <h2 className="text-2xl font-black text-gray-900">{selectedCrop.name}</h2>
              </div>
              <button onClick={() => setSelectedCrop(null)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8 pb-10">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest">
                  <BookOpen size={16} /> Growing Conditions
                </div>
                <div className="text-sm text-gray-700 leading-relaxed font-bold bg-green-50/50 p-6 rounded-3xl border border-green-50">
                  {selectedCrop.growing}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                  <Droplets size={16} /> Fertilizer Schedule
                </div>
                <div className="text-sm text-gray-700 leading-relaxed font-bold bg-blue-50/50 p-6 rounded-3xl border border-blue-50">
                  {selectedCrop.fertilizers}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-widest">
                  <Bug size={16} /> Diseases & Pests
                </div>
                <div className="text-sm text-gray-700 leading-relaxed font-bold bg-red-50/50 p-6 rounded-3xl border border-red-50">
                  {selectedCrop.diseases}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest">
                  <Sparkles size={16} /> Organic Solutions
                </div>
                <div className="text-sm text-gray-700 leading-relaxed font-bold bg-orange-50/50 p-6 rounded-3xl border border-orange-50">
                  {selectedCrop.organic}
                </div>
              </section>

              <button 
                onClick={() => {
                  const query = `Tell me more about growing ${selectedCrop.name} organically and how to deal with common pests.`;
                  navigate('/assistant', { state: { initialQuery: query } });
                }}
                className="w-full bg-gray-900 text-white font-bold py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
              >
                <Sparkles size={20} className="text-yellow-400" /> Ask Sahayak AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agri Assistant Floating Access */}
      <button 
        onClick={() => navigate('/assistant')}
        className="fixed bottom-24 right-6 bg-white p-4 rounded-full shadow-2xl border-2 border-green-100 flex items-center gap-2 z-50 animate-bounce active:animate-none"
      >
        <Sparkles size={24} className="text-green-600" />
        <span className="text-xs font-black text-green-800 pr-1">Agri Sahayak</span>
      </button>
    </div>
  );
};

export default Guide;
