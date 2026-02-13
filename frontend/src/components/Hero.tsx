import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft, MdClose, MdExpandMore, MdExpandLess } from "react-icons/md";
import { useSwipeable } from 'react-swipeable';

interface HeroProps {
  items: any[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  onBack: () => void;
}

export const Hero = ({ items, activeIndex, setActiveIndex, onBack }: HeroProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const current = items[activeIndex];

  useEffect(() => {
    setIsExpanded(false);
  }, [activeIndex]);

  useEffect(() => {
  const originalStyle = window.getComputedStyle(document.body).overflow;
  document.body.style.overflow = 'hidden';
  
  return () => {
    document.body.style.overflow = originalStyle;
  };
}, []);

  const navigate = useCallback((direction: number) => {
    setActiveIndex((prev) => {
      if (items.length === 0) return 0;
      const next = prev + direction;
      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;
      return next;
    });
  }, [items.length, setActiveIndex]);

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate(1),
    onSwipedRight: () => navigate(-1),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 10 
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onBack]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-8 lg:p-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onBack}
        className="absolute inset-0 backdrop-blur-md cursor-zoom-out"
      />

      <motion.div 
        {...handlers}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl h-full max-h-[85vh] bg-black border border-white/10 overflow-hidden shadow-2xl flex flex-col rounded-sm"
      >
        <button 
          onClick={onBack}
          className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-white hover:text-black transition-all rounded-full border border-white/10 hover:cursor-pointer"
        >
          <MdClose size={20} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={current?.date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0"
          >
            <div 
              className="absolute inset-0 -top-20 sm:top-0 bg-contain bg-no-repeat bg-center transition-transform duration-700"
              style={{ backgroundImage: `url(${current?.hdurl || current?.url})` }}
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/95" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 grow flex flex-col justify-end p-6 sm:p-10 overflow-hidden">
          <main className="w-full max-w-4xl mb-6 sm:mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current?.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="relative">
                  <div className={`
                    relative transition-all duration-500 rounded-lg overflow-hidden
                    ${isExpanded ? 'bg-black/60 backdrop-blur-sm py-4 pr-4' : ''}
                  `}>
                    <div className={`
                      relative transition-all duration-500
                      ${isExpanded ? 'max-h-[30vh] overflow-y-auto custom-scrollbar' : 'max-h-16 overflow-hidden'}
                    `}>
                      <p className={`text-xs sm:text-sm md:text-base text-white/80 font-light leading-relaxed ${isExpanded?"pl-2":""} pr-2`}>
                        {current?.explanation}
                      </p>
                      
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 flex items-center gap-1 text-[10px] sm:text-[12px] tracking-widest uppercase text-white hover:cursor-pointer hover:underline transition-colors"
                  >
                    {isExpanded ? (
                      <> Show Less <MdExpandLess size={16} /></>
                    ) : (
                      <> Read More <MdExpandMore size={16} /></>
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="w-full space-y-5">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-[9px] tracking-[0.2em]">
                <button onClick={() => navigate(-1)} className="p-1.5 border border-white/40 rounded hover:bg-white hover:cursor-pointer hover:text-black transition-colors">
                  <MdOutlineKeyboardArrowLeft size={16}/>
                </button>
                <button onClick={() => navigate(1)} className="p-1.5 border border-white/40 rounded hover:bg-white hover:cursor-pointer hover:text-black transition-colors">
                  <MdOutlineKeyboardArrowRight size={16}/>
                </button>
                <span className="ml-2 hidden sm:inline uppercase ">Use Keyboard Arrows</span>
                <span className="ml-2 inline sm:hidden uppercase ">Swipe or click arrows</span>
              </div>
              
              <div className="text-right">
                <p className="text-xs sm:text-lg font-bold tracking-tighter tabular-nums">
                  {String(activeIndex + 1).padStart(3, '0')} <span className="text-white/20">/</span> {String(items.length).padStart(3, '0')}
                </p>
              </div>
            </div>

            <div className="w-full h-0.5 bg-white/10 relative">
              <motion.div 
                className="absolute h-full bg-white shadow-[0_0_10px_white]"
                initial={{ width: 0 }}
                animate={{ width: `${((activeIndex + 1) / items.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              />
            </div>
          </footer>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};