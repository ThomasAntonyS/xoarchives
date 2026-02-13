import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import logo from '../assets/logo.png';

export const Header = ({ onDateSelect, setViewMode }: { onDateSelect: (date: string) => void, setViewMode: (mode: 'gallery' | 'hero') => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  const years = Array.from({ length: currentYear - 1995 + 1 }, (_, i) => currentYear - i);

  const isFuture = (year: number, month: number) => {
    return year > currentYear || (year === currentYear && month > currentMonth);
  };

  return (
    <header className={`fixed top-0 w-full z-150 p-6 sm:px-12 sm:py-6 flex justify-between items-center transition-all duration-500 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-transparent'
    }`}>
      <button 
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setViewMode('gallery');
          setIsOpen(false);
        }}
        className="pointer-events-auto cursor-pointer"
      >
        <img src={logo} alt="Logo" className="h-3 w-auto object-contain brightness-200" />
      </button>

      <div 
        ref={menuRef}
        className="relative pointer-events-auto flex flex-col items-end"
        onMouseEnter={() => window.innerWidth > 768 && setIsOpen(true)}
        onMouseLeave={() => window.innerWidth > 768 && setIsOpen(false)}
      >
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-[11px] tracking-[0.2em] cursor-pointer text-white uppercase transition-colors pb-2"
        >
          Archive
          {isOpen ? <MdKeyboardArrowUp size={18}/> : <MdKeyboardArrowDown size={18}/>}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full right-0 bg-zinc-950 border border-white/10 p-6 w-[75vw] sm:w-[320px] shadow-2xl rounded-sm mt-1"
            >
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {years.map((year) => {
                  const phase1Disabled = isFuture(year, 0);
                  const phase2Disabled = isFuture(year, 6);

                  return (
                    <div key={year} className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-white border-b border-white/10 pb-1 mb-1 tabular-nums">
                        {year}
                      </span>
                      
                      <button 
                        disabled={phase1Disabled}
                        onClick={() => { 
                          onDateSelect(`${year}-01-01`); 
                          setViewMode('gallery');
                          setIsOpen(false);
                        }}
                        className={`text-[9px] text-left transition-colors uppercase w-max tracking-wider ${
                          phase1Disabled ? 'text-white/20' : 'text-white/60 hover:text-white cursor-pointer active:scale-95'
                        }`}
                      >
                        Jan — Jun
                      </button>

                      <button 
                        disabled={phase2Disabled}
                        onClick={() => { 
                          onDateSelect(`${year}-07-01`); 
                          setViewMode('gallery');
                          setIsOpen(false);
                        }}
                        className={`text-[9px] text-left transition-colors uppercase w-max tracking-wider ${
                          phase2Disabled ? 'text-white/20' : 'text-white/60 hover:text-white cursor-pointer active:scale-95'
                        }`}
                      >
                        Jul — Dec
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </header>
  );
};