import React from 'react';

type SuggestionCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
};

export default function SuggestionCard({ icon, title, subtitle, onClick }: SuggestionCardProps) {
  return (
    <button 
      onClick={onClick} 
      className="text-right p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex flex-col gap-1.5 group h-full w-full"
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="font-medium text-sm text-gray-200">{title}</span>
      </div>
      <span className="text-xs text-gray-400 pr-7">{subtitle}</span>
    </button>
  );
}