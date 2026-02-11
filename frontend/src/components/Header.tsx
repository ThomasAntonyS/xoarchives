import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import logo from '../assets/logo.png';

export const Header = ({ onDateSelect }: { onDateSelect: (date: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => currentYear - i);

  const isFuture = (year: number, month: number) => {
    return year > currentYear || (year === currentYear && month > currentMonth);
  };

  return (
    <header className="fixed top-0 w-full z-50 p-6 sm:px-12 sm:py-6 flex justify-between items-center pointer-events-none">
      <a href='/' className="pointer-events-auto">
        <img src={logo} alt="Logo" className="h-3 w-auto object-contain brightness-200" />
      </a>

      <div 
        className="relative pointer-events-auto flex flex-col items-end"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button 
          className="flex items-center gap-1 text-[11px] tracking-widest hover:cursor-pointer text-white uppercase transition-colors pb-2"
        >
          Archive
          {isOpen ? <MdKeyboardArrowUp size={18}/> : <MdKeyboardArrowDown size={18}/>}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 bg-black border border-white/20 p-6 w-70 sm:w-[320px] shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {years.map((year) => {
                  const phase1Disabled = isFuture(year, 0);
                  const phase2Disabled = isFuture(year, 6);

                  return (
                    <div key={year} className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-white border-b border-white/10 pb-1 mb-1">
                        {year}
                      </span>
                      
                      <button 
                        disabled={phase1Disabled}
                        onClick={() => { onDateSelect(`${year}-01-01`); setIsOpen(false); }}
                        className={`text-[10px] text-left transition-colors uppercase w-max ${
                          phase1Disabled 
                          ? 'text-white/30 cursor-not-allowed' 
                          : 'text-white/80 hover:text-white hover:cursor-pointer'
                        }`}
                      >
                        Jan — Jun
                      </button>

                      <button 
                        disabled={phase2Disabled}
                        onClick={() => { onDateSelect(`${year}-07-01`); setIsOpen(false); }}
                        className={`text-[10px] text-left transition-colors uppercase w-max ${
                          phase2Disabled 
                          ? 'text-white/30 cursor-not-allowed' 
                          : 'text-white/80 hover:text-white hover:cursor-pointer'
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
    </header>
  );
};