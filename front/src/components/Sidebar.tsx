import { Sparkles, Plus, MoreHorizontal } from 'lucide-react';

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onNewChat: () => void;
};

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, onNewChat }: SidebarProps) {
  return (
    <>
      <aside className={`
        fixed md:relative z-20 h-full w-[260px] flex-shrink-0 flex flex-col 
        bg-[#020617] border-l border-white/5 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-3 mb-2 sticky top-0 z-10">
          <button 
            onClick={() => { onNewChat(); setIsSidebarOpen(false); }}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg hover:bg-[#334155] transition-colors group border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30 text-blue-400">
                <Sparkles size={14} fill="currentColor" />
              </div>
              <span className="text-sm font-medium text-gray-200">שיחה חדשה</span>
            </div>
            <Plus size={18} className="text-gray-400 group-hover:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-6">
           {/* כאן תבוא ההיסטוריה בעתיד */}
           <div className="text-gray-500 text-xs text-center mt-10">אין היסטוריה עדיין</div>
        </div>

        <div className="p-3 mt-auto border-t border-white/5">
          <button className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-[#334155] transition-colors text-sm">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">AT</div>
             <div className="flex flex-col items-start">
               <span className="font-semibold text-gray-200">Armored Tech</span>
               <span className="text-[10px] text-gray-400">תוכנית Pro</span>
             </div>
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}