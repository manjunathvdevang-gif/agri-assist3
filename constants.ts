
import { Language, CropPrice, BuyerListing, UserListing } from './types';

export const LANGUAGES: Record<Language, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  hi: { label: 'Hindi', native: 'हिन्दी' },
  kn: { label: 'Kannada', native: 'ಕನ್ನಡ' },
  te: { label: 'Telugu', native: 'తెలుగు' },
  ta: { label: 'Tamil', native: 'தமிழ்' },
  mr: { label: 'Marathi', native: 'मराठी' },
  ml: { label: 'Malayalam', native: 'മലയാളം' },
  gu: { label: 'Gujarati', native: 'ગુજરાતી' },
  bn: { label: 'Bengali', native: 'বাংলা' },
  pa: { label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  or: { label: 'Odia', native: 'ଓଡ଼ିଆ' },
  as: { label: 'Assamese', native: 'অসমীয়া' },
  ur: { label: 'Urdu', native: 'اردو' },
};

export const KARNATAKA_LOCATIONS = [
  // Dakshina Kannada
  "Mangaluru, KA", "Bantwal, KA", "Dharmasthala, KA", "Surathkal, KA",
  "Puttur, KA", "Sullia, KA", "Belthangady, KA", "Moodabidri, KA",
  "Ullal, KA", "Mulki, KA", "Vittal, KA", "Kadaba, KA", "Subramanya, KA",
  
  // Udupi & Shivamogga
  "Udupi, KA", "Kundapura, KA", "Karkala, KA", "Manipal, KA",
  "Shivamogga, KA", "Bhadravati, KA", "Sagar, KA", "Shikaripura, KA", "Thirthahalli, KA",

  // Chikkamagaluru
  "Chikkamagaluru, KA", "Kadur, KA", "Tarikere, KA", "Mudigere, KA", 
  "Koppa, KA", "Sringeri, KA", "Narasimharajapura (N.R. Pura), KA", "Birur, KA", "Ajjamapura, KA",

  // South Interior
  "Mysuru, KA", "Mandya, KA", "Hassan, KA",
  "Tumakuru, KA", "Chitradurga, KA", "Davanagere, KA",
  "Kolar, KA", "Chikballapur, KA", "Ramanagara, KA", "Channapatna, KA"
];

export const NORTH_KA_LOCATIONS = [
  // Dharwad District
  "Dharwad, KA", "Hubballi, KA", "Kalghatgi, KA", "Kundgol, KA", "Navalgund, KA", "Alnavar, KA", "Annigeri, KA",

  // Belagavi (Belgum) District
  "Belagavi, KA", "Gokak, KA", "Athani, KA", "Bailhongal, KA", "Saundatti (Savadatti), KA", 
  "Ramdurg, KA", "Chikkodi, KA", "Hukkeri, KA", "Raybag, KA", "Khanapur, KA", 
  "Kittur, KA", "Nipani, KA", "Mudalgi, KA", "Sankeshwar, KA", "Kagwad, KA",

  // Bagalkot District
  "Bagalkot, KA", "Jamkhandi, KA", "Mudhol, KA", "Badami, KA", "Bilagi, KA", 
  "Hungund, KA", "Ilkal, KA", "Guledgudda, KA", "Rabkavi Banhatti, KA", "Terdal, KA",

  // Uttara Kannada District
  "Karwar, KA", "Sirsi, KA", "Bhatkal, KA", "Kumta, KA", "Ankola, KA", 
  "Honnavar, KA", "Haliyal, KA", "Yellapur, KA", "Mundgod, KA", "Joida, KA", 
  "Dandeli, KA", "Gokarna, KA", "Murdeshwar, KA",

  // Vijayapura & Others
  "Vijayapura, KA", "Indi, KA", "Sindgi, KA", "Basavana Bagewadi, KA", "Talikoti, KA",
  "Kalaburagi, KA", "Sedam, KA", "Yadgir, KA", "Shahapur, KA", "Shorapur, KA",
  "Raichur, KA", "Sindhanur, KA", "Manvi, KA", "Lingsugur, KA",
  "Koppal, KA", "Gangavathi, KA", "Kushtagi, KA", "Yelburga, KA",
  "Gadag, KA", "Ron, KA", "Nargund, KA", "Mundargi, KA",
  "Haveri, KA", "Ranebennur, KA", "Byadgi, KA", "Hirekerur, KA", "Shiggaon, KA",
  "Ballari, KA", "Hosapete, KA", "Sandur, KA", "Siruguppa, KA",
  "Bidar, KA", "Basavakalyan, KA", "Bhalki, KA", "Humnabad, KA"
];

export const MAHARASHTRA_LOCATIONS = [
  "Mumbai, MH", "Pune, MH", "Nashik, MH", "Nagpur, MH", "Aurangabad, MH",
  "Solapur, MH", "Pandharpur, MH", "Akkalkot, MH", "Barshi, MH", "Mangalvedha, MH",
  "Kolhapur, MH", "Ichalkaranji, MH", "Kagal, MH", "Panhala, MH",
  "Sangli, MH", "Miraj, MH", "Tasgaon, MH", "Islampur, MH",
  "Satara, MH", "Karad, MH", "Phaltan, MH", "Mahabaleshwar, MH",
  "Latur, MH", "Udgir, MH", "Ausa, MH", "Nilanga, MH",
  "Osmanabad (Dharashiv), MH", "Tuljapur, MH", "Omerga, MH",
  "Nanded, MH", "Bhokar, MH", "Deglur, MH",
  "Parbhani, MH", "Gangakhed, MH", "Hingoli, MH",
  "Beed, MH", "Ambejogai, MH", "Parli, MH", "Majalgaon, MH",
  "Ahmednagar, MH", "Shirdi, MH", "Sangamner, MH", "Kopargaon, MH",
  "Dhule, MH", "Shirpur, MH", "Jalgaon, MH", "Bhusawal, MH",
  "Akola, MH", "Amravati, MH", "Yavatmal, MH", "Washim, MH", "Buldhana, MH"
];

export const ALL_LOCATIONS = [
  ...KARNATAKA_LOCATIONS,
  ...NORTH_KA_LOCATIONS,
  ...MAHARASHTRA_LOCATIONS,
  "Hyderabad, TS", "Warangal, TS", "Nizamabad, TS",
  "Kurnool, AP", "Guntur, AP", "Vijayawada, AP", "Anantapur, AP",
  "Chennai, TN", "Coimbatore, TN", "Madurai, TN", "Salem, TN",
  "Thiruvananthapuram, KL", "Kochi, KL", "Kozhikode, KL"
].sort();

export const CROP_CATEGORIES = {
  GRAIN: ['Wheat', 'Rice (Paddy)', 'Maize', 'Millet', 'Barley', 'Pulses', 'Soybean', 'Jowar', 'Ragi', 'Bajra'],
  VEGETABLE: ['Tomato', 'Onion', 'Potato', 'Brinjal', 'Cauliflower', 'Spinach', 'Carrot', 'Chilli', 'Okra', 'Cabbage', 'Ginger', 'Garlic', 'Radish', 'Pumpkin'],
  FRUIT: ['Mango', 'Banana', 'Apple', 'Orange', 'Grapes', 'Pomegranate', 'Guava', 'Papaya', 'Watermelon', 'Pineapple', 'Custard Apple']
};

export const ALL_CROP_NAMES = [
  ...CROP_CATEGORIES.GRAIN,
  ...CROP_CATEGORIES.VEGETABLE,
  ...CROP_CATEGORIES.FRUIT
].sort();

export const UNITS = ['Quintal', 'Kg', 'Ton', 'Box', 'Dozen'];

export const MOCK_CROPS: CropPrice[] = [
  { id: '1', name: 'Wheat (Lokwan)', mandi: 'Pune', price: 2600, unit: 'q', trend: 'up', change: '+2.4%', date: '2024-05-20' },
  { id: '2', name: 'Rice (Sona)', mandi: 'Mysuru', price: 3400, unit: 'q', trend: 'up', change: '+1.8%', date: '2024-05-20' },
  { id: '3', name: 'Tomato', mandi: 'Nashik', price: 1800, unit: 'q', trend: 'down', change: '-3.1%', date: '2024-05-20' },
];

export const AVAILABLE_STOCK: (UserListing & { farmerName: string, location: string, phone: string })[] = [
  { id: 's1', cropName: 'Tomato', quantity: '200 Kg', price: 1400, date: '2024-05-21', farmerName: 'Somanna Gowda', location: 'Mysuru, KA', phone: '9845012345' },
  { id: 's2', cropName: 'Rice (Paddy)', quantity: '50 Quintal', price: 3400, date: '2024-05-20', farmerName: 'Basavaraj K', location: 'Mandya, KA', phone: '9900112233' },
  { id: 's3', cropName: 'Onion', quantity: '10 Ton', price: 1800, date: '2024-05-19', farmerName: 'Ramesh Patil', location: 'Haveri, KA', phone: '9448055667' },
  { id: 's4', cropName: 'Chilli', quantity: '100 Kg', price: 65, date: '2024-05-22', farmerName: 'Manjunath', location: 'Belagavi, KA', phone: '8877665544' },
];