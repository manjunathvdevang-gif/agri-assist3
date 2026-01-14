
import React from 'react';
import { LANGUAGES } from '../constants';
import { Language } from '../types';

interface Props {
  current: Language;
  onSelect: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ current, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {(Object.entries(LANGUAGES) as [Language, typeof LANGUAGES['en']][]).map(([key, value]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            current === key
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          {value.native}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
