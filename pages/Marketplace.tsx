
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Filter, Phone, MapPin, ChevronLeft, 
  Plus, X, MessageSquare, Sparkles, User, 
  SlidersHorizontal, ShoppingBag, Info, UserCircle,
  ChevronDown, Save, Tag, Box, DollarSign, Wand2, Loader2, LogOut, AlertCircle,
  Trash2, Edit, ArrowUpDown, Bookmark
} from 'lucide-react';
import { UserRole, UserListing } from '../types';
import { CROP_CATEGORIES, UNITS, AVAILABLE_STOCK, ALL_CROP_NAMES } from '../constants';
import { getPriceSuggestion } from '../services/geminiService';

interface Props {
  role: UserRole;
}

const Marketplace: React.FC<Props> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Tabs: Farmer has 'find'/'mine', Consumer has 'browse'/'saved'
  const [activeTab, setActiveTab] = useState<'find' | 'mine' | 'browse' | 'saved'>(
    role === 'consumer' ? 'browse' : 'find'
  );
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [confirmationConfig, setConfirmationConfig] = useState<{title: string, message: string, action: () => void} | null>(null);
  
  // Sorting & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'price-high' | 'price-low'>('newest');

  // Editing State
  const [editingItem, setEditingItem] = useState<UserListing | null>(null);

  // Initialize Farmer Stock from Local Storage
  const [myStock, setMyStock] = useState<UserListing[]>(() => {
    const saved = localStorage.getItem('agri_user_stock');
    return saved ? JSON.parse(saved) : [
      { id: '1', cropName: 'Onion', quantity: '50 Quintal', price: 1200, date: '2024-05-20' }
    ];
  });

  // Initialize Consumer Saved Items from Local Storage
  const [savedItems, setSavedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('agri_consumer_saved');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist Farmer Stock
  useEffect(() => {
    localStorage.setItem('agri_user_stock', JSON.stringify(myStock));
  }, [myStock]);

  // Persist Consumer Saved Items
  useEffect(() => {
    localStorage.setItem('agri_consumer_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  const buyers = useMemo(() => [
    { id: 'b1', crop: 'Onion', price: 1250, location: 'Nashik, MH', dist: '12 km', buyer: 'Fresh Agro Traders', phone: '9123456780', date: 'Yesterday' },
    { id: 'b2', crop: 'Wheat', price: 2680, location: 'Mandya, KA', dist: '45 km', buyer: 'Karnataka Grain Hub', phone: '8234567891', date: 'Today' },
    { id: 'b3', crop: 'Tomato', price: 1600, location: 'Mysuru, KA', dist: '8 km', buyer: 'Veggies Direct', phone: '7345678902', date: 'Today' },
    { id: 'b4', crop: 'Rice (Paddy)', price: 3450, location: 'Shivamogga, KA', dist: '25 km', buyer: 'Malnad Rice Mills', phone: '9900887766', date: 'Today' },
  ], []);

  const filteredItems = useMemo(() => {
    let list: any[] = [];
    
    if (role === 'farmer') {
      if (activeTab === 'mine') {
        list = [...myStock];
      } else {
        list = [...buyers];
      }
    } else {
      // CONSUMER LOGIC
      // Combine "My Stock" (simulating other farmers) + Static Available Stock
      const farmerListings = myStock.map(item => ({
        ...item,
        farmerName: 'Local Farmer (New)', 
        location: 'My Region', 
        phone: '98******21',
        isNew: true
      }));
      const allListings = [...farmerListings, ...AVAILABLE_STOCK];

      if (activeTab === 'saved') {
        list = allListings.filter(item => savedItems.includes(item.id));
      } else {
        list = allListings;
      }
    }
    
    // Filtering
    let result = list.filter(item => {
      const name = item.cropName || item.crop;
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = item.location?.toLowerCase().includes(locationFilter.toLowerCase()) ?? true;
      const matchesCropType = cropFilter === '' || name === cropFilter;
      return matchesSearch && matchesLocation && matchesCropType;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'price-high') return b.price - a.price;
      if (sortOrder === 'price-low') return a.price - b.price;
      // Using ID as proxy for creation time (since ID is Date.now() for new items)
      // For static items, we just use string comparison fallback if not numeric
      const idA = parseInt(a.id) || 0;
      const idB = parseInt(b.id) || 0;
      if (sortOrder === 'newest') return idB - idA;
      if (sortOrder === 'oldest') return idA - idB;
      return 0;
    });

    return result;
  }, [searchQuery, locationFilter, cropFilter, buyers, activeTab, myStock, sortOrder, savedItems, role]);

  const [newStock, setNewStock] = useState({ 
    category: 'GRAIN' as keyof typeof CROP_CATEGORIES,
    name: '', 
    quantity: '', 
    unit: 'Quintal',
    price: '' 
  });

  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);
  const [suggestedPriceNote, setSuggestedPriceNote] = useState('');

  const initiateAddOrEditStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStock.name && newStock.price) {
      if (editingItem) {
        performUpdateStock(); 
      } else {
        setConfirmationConfig({
          title: "Confirm Listing",
          message: `Are you sure you want to list ${newStock.quantity} ${newStock.unit} of ${newStock.name} for ₹${newStock.price}? This will be visible to buyers immediately.`,
          action: () => performAddStock()
        });
      }
    }
  };

  const performAddStock = () => {
    const stockItem: UserListing = { 
      id: Date.now().toString(), 
      cropName: newStock.name, 
      quantity: `${newStock.quantity} ${newStock.unit}`, 
      price: Number(newStock.price),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };
    setMyStock([stockItem, ...myStock]);
    closeModal();
    setActiveTab('mine');
    setConfirmationConfig(null);
  };

  const performUpdateStock = () => {
    if (!editingItem) return;
    
    const updatedList = myStock.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          cropName: newStock.name,
          quantity: `${newStock.quantity} ${newStock.unit}`,
          price: Number(newStock.price),
        };
      }
      return item;
    });
    
    setMyStock(updatedList);
    closeModal();
  };

  const initiateDelete = (id: string, name: string) => {
    setConfirmationConfig({
      title: "Delete Listing",
      message: `Are you sure you want to remove ${name} from your stock? This action cannot be undone.`,
      action: () => {
        setMyStock(prev => prev.filter(item => item.id !== id));
        setConfirmationConfig(null);
      }
    });
  };

  const toggleSaveItem = (id: string) => {
    setSavedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const openEditModal = (item: UserListing) => {
    const [qty, ...unitParts] = item.quantity.split(' ');
    const unit = unitParts.join(' ');
    
    let category: keyof typeof CROP_CATEGORIES = 'GRAIN';
    for (const [cat, crops] of Object.entries(CROP_CATEGORIES)) {
      if (crops.includes(item.cropName)) {
        category = cat as keyof typeof CROP_CATEGORIES;
        break;
      }
    }

    setEditingItem(item);
    setNewStock({
      category,
      name: item.cropName,
      quantity: qty,
      unit: unit as string,
      price: item.price.toString()
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setNewStock({ category: 'GRAIN', name: '', quantity: '', unit: 'Quintal', price: '' });
    setSuggestedPriceNote('');
  };

  const initiateContact = (contact: any) => {
    setConfirmationConfig({
      title: "Confirm Contact",
      message: `Do you want to reveal contact details for ${contact.farmerName || contact.buyer}?`,
      action: () => {
        setSelectedContact({ type: role === 'consumer' ? 'farmer' : 'buyer', ...contact });
        setConfirmationConfig(null);
      }
    });
  };

  const suggestPrice = async () => {
    if (!newStock.name) return;
    setIsSuggestingPrice(true);
    const suggestion = await getPriceSuggestion(newStock.name, "Your Location", "en");
    setSuggestedPriceNote(suggestion || "No suggestion found.");
    setIsSuggestingPrice(false);
  };

  const handleLogout = () => {
    window.location.href = '#/welcome';
    window.location.reload();
  };

  const categoryCrops = useMemo(() => {
    return CROP_CATEGORIES[newStock.category] || [];
  }, [newStock.category]);

  return (
    <div className="pb-24 relative min-h-screen bg-[#FDFDFD]">
      {/* Sticky Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isHome && (
              <ChevronLeft size={24} className="text-gray-600 cursor-pointer" onClick={() => navigate('/')} />
            )}
            
            {role === 'consumer' && isHome && (
              <button 
                onClick={handleLogout}
                className="text-red-500 p-2 hover:bg-red-50 rounded-full flex items-center gap-1 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-lg"><ShoppingBag size={18} className="text-green-600" /></div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Marketplace</h1>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          {role === 'farmer' ? (
            <div className="flex bg-gray-100 p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('find')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'find' ? 'bg-white shadow-md text-gray-900' : 'text-gray-500'
                }`}
              >
                Find Buyers
              </button>
              <button 
                onClick={() => setActiveTab('mine')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'mine' ? 'bg-white shadow-md text-gray-900' : 'text-gray-500'
                }`}
              >
                My Stock
              </button>
            </div>
          ) : (
            <div className="flex bg-gray-100 p-1 rounded-2xl">
              <button 
                onClick={() => setActiveTab('browse')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'browse' ? 'bg-white shadow-md text-gray-900' : 'text-gray-500'
                }`}
              >
                Browse Crops
              </button>
              <button 
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'saved' ? 'bg-white shadow-md text-gray-900' : 'text-gray-500'
                }`}
              >
                <Bookmark size={14} className={activeTab === 'saved' ? 'fill-current' : ''} /> Saved
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-6">
          <div className="flex gap-2">
            <div className="flex-1 bg-white border-2 border-green-200 rounded-[1.5rem] px-5 py-5 flex items-center gap-3 shadow-lg focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-100 transition-all transform hover:scale-[1.01]">
              <Search size={24} className="text-green-600" />
              <input 
                type="text" 
                placeholder={role === 'consumer' ? "Search vegetables, fruits..." : "Search buyers, crops..."}
                className="bg-transparent outline-none text-lg w-full font-bold text-gray-800 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4 rounded-[1.5rem] shadow-lg transition-all border-2 ${
                showFilters || locationFilter || cropFilter ? 'bg-green-600 text-white border-green-600 scale-105' : 'bg-white text-gray-600 border-green-100 hover:border-green-300'
              }`}
            >
              <Filter size={24} />
            </button>
          </div>

          {showFilters && (
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Crop Name</label>
                <div className="relative">
                  <select 
                    value={cropFilter} 
                    onChange={e => setCropFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none text-sm font-bold"
                  >
                    <option value="">All Crops</option>
                    {ALL_CROP_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Region Filter</label>
                <input 
                  type="text" 
                  placeholder="City or Village"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none text-sm font-bold focus:border-green-500"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <button onClick={() => { setCropFilter(''); setLocationFilter(''); }} className="text-xs text-red-500 font-bold uppercase tracking-wider">Reset Filters</button>
            </div>
          )}

          <div className="space-y-4">
            {/* Sorting Header */}
             <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {filteredItems.length} {activeTab === 'saved' ? 'Saved Items' : 'Listings'}
                </p>
                <div className="relative">
                   <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1.5">
                     <ArrowUpDown size={14} className="text-gray-500" />
                     <select 
                       value={sortOrder}
                       onChange={(e) => setSortOrder(e.target.value as any)}
                       className="bg-transparent text-xs font-bold text-gray-700 outline-none appearance-none pr-4"
                     >
                       <option value="newest">Newest First</option>
                       <option value="oldest">Oldest First</option>
                       <option value="price-high">Price: High to Low</option>
                       <option value="price-low">Price: Low to High</option>
                     </select>
                   </div>
                </div>
             </div>

            {role === 'farmer' && activeTab === 'mine' && (
              <button 
                onClick={() => { closeModal(); setShowAddModal(true); }}
                className="w-full bg-green-600 text-white p-6 rounded-[2rem] shadow-xl shadow-green-100 flex flex-col items-center gap-3 active:scale-[0.98] transition-all hover:bg-green-700"
              >
                <div className="bg-white/20 p-2 rounded-full"><Plus size={32} /></div>
                <span className="font-bold text-lg">Add New Produce</span>
              </button>
            )}

            {filteredItems.length > 0 ? filteredItems.map((item: any) => (
              <div key={item.id} className={`bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow ${item.isNew ? 'border-green-200 bg-green-50/30' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                      {item.cropName || item.crop}
                      {item.isNew && <span className="text-[8px] bg-green-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <MapPin size={10} /> {item.location || 'Your Farm'} {item.dist ? `• ${item.dist}` : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-green-600 leading-none mb-1">
                      ₹{item.price.toLocaleString()}{item.unit ? `/${item.unit}` : '/q'}
                    </p>
                    {item.quantity && <p className="text-[10px] text-gray-400 font-bold uppercase">{item.quantity}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    {/* User Avatar for Non-Owner Views */}
                    {((role === 'farmer' && activeTab === 'find') || (role === 'consumer')) && (
                      <>
                        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold text-xs uppercase border border-green-100">
                          {(item.farmerName || item.buyer || "A").charAt(0)}
                        </div>
                        <p className="text-sm font-bold text-gray-700">{item.farmerName || item.buyer}</p>
                      </>
                    )}
                    
                    {/* Owner View Details */}
                    {role === 'farmer' && activeTab === 'mine' && (
                       <span className="text-[10px] text-gray-400 font-bold uppercase">Listed on {item.date}</span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {role === 'farmer' && activeTab === 'mine' ? (
                      <>
                        <button 
                          onClick={() => openEditModal(item)}
                          className="bg-blue-50 text-blue-600 p-2 rounded-xl active:scale-95 transition-all"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => initiateDelete(item.id, item.cropName)}
                          className="bg-red-50 text-red-600 p-2 rounded-xl active:scale-95 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : role === 'consumer' ? (
                      <>
                        <button 
                          onClick={() => toggleSaveItem(item.id)}
                          className={`p-2 rounded-xl border transition-all active:scale-95 ${
                            savedItems.includes(item.id) 
                              ? 'bg-green-100 text-green-600 border-green-200' 
                              : 'bg-white text-gray-400 border-gray-100'
                          }`}
                          title={savedItems.includes(item.id) ? "Unsave" : "Save"}
                        >
                          <Bookmark size={18} className={savedItems.includes(item.id) ? "fill-current" : ""} />
                        </button>
                        <button 
                          onClick={() => initiateContact({ type: 'farmer', ...item })}
                          className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all"
                        >
                          <Phone size={12} /> Contact
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => initiateContact({ type: 'buyer', ...item })}
                        className="bg-green-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all"
                      >
                        <Phone size={12} /> Contact Buyer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-gray-400 font-medium">No items found matching your search.</p>
                {activeTab === 'saved' && (
                  <button onClick={() => setActiveTab('browse')} className="text-green-600 font-bold text-sm mt-2 underline">
                    Browse all crops
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationConfig && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{confirmationConfig.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {confirmationConfig.message}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmationConfig(null)}
                className="flex-1 py-3.5 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmationConfig.action}
                className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 py-2">
              <h2 className="text-2xl font-bold text-gray-900">{editingItem ? 'Edit Produce' : 'List Your Produce'}</h2>
              <button onClick={closeModal} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={initiateAddOrEditStock} className="space-y-6 pb-6">
              {/* Category Selection First */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Produce Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CROP_CATEGORIES) as Array<keyof typeof CROP_CATEGORIES>).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewStock({...newStock, category: cat, name: CROP_CATEGORIES[cat][0]})}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter border-2 transition-all ${
                        newStock.category === cat ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 text-gray-400 border-transparent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Crop Name</label>
                <div className="relative">
                   <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <select 
                    value={newStock.name}
                    onChange={e => setNewStock({...newStock, name: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-400 p-4 pl-12 rounded-2xl font-bold appearance-none outline-none transition-all"
                    required
                  >
                    <option value="" disabled>Select {newStock.category.toLowerCase()}</option>
                    {categoryCrops.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
                  <div className="relative">
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="number" 
                      placeholder="Amount"
                      value={newStock.quantity}
                      onChange={e => setNewStock({...newStock, quantity: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-400 p-4 pl-12 rounded-2xl font-bold outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                  <div className="relative">
                    <select 
                      value={newStock.unit} 
                      onChange={e => setNewStock({...newStock, unit: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-400 p-4 rounded-2xl font-bold appearance-none outline-none transition-all"
                    >
                      {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                  Expected Price (Per {newStock.unit})
                  <button 
                    type="button" 
                    onClick={suggestPrice}
                    className="flex items-center gap-1 text-green-600 font-black lowercase tracking-normal"
                  >
                    <Wand2 size={12} /> Suggest Price
                  </button>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    placeholder="Rate in ₹"
                    value={newStock.price}
                    onChange={e => setNewStock({...newStock, price: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-400 p-4 pl-12 rounded-2xl font-bold outline-none transition-all text-green-700"
                    required
                  />
                  {isSuggestingPrice && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="animate-spin text-green-600" size={18} />
                    </div>
                  )}
                </div>
                {suggestedPriceNote && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-xl text-[11px] text-green-800 font-medium">
                    <Sparkles className="inline mr-1" size={12} /> {suggestedPriceNote}
                  </div>
                )}
              </div>
              
              <button 
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-5 rounded-3xl shadow-xl flex items-center justify-center gap-2 text-lg active:scale-95 transition-all hover:bg-green-700"
              >
                <Save size={20} /> {editingItem ? 'Update Listing' : 'List Produce Now'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Agri Assistant Access */}
      <button 
        onClick={() => navigate('/assistant')}
        className="fixed bottom-24 right-6 bg-green-500 p-4 rounded-full shadow-2xl text-white z-50 flex items-center justify-center animate-bounce shadow-green-200"
      >
        <Sparkles size={28} />
      </button>
    </div>
  );
};

export default Marketplace;
