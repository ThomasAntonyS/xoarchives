import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useSwipeable } from 'react-swipeable';
import { JellyTriangle } from 'ldrs/react'
import 'ldrs/react/JellyTriangle.css'

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

interface HeroProps {
  selectedDate: string | null;
}

export const Hero = ({ selectedDate }: HeroProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useCallback((direction: number) => {
    setActiveIndex((prev) => {
      if (items.length === 0) return 0;
      const next = prev + direction;
      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;
      return next;
    });
  }, [items.length]);

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate(1),
    onSwipedRight: () => navigate(-1),
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 10 
  });

  useEffect(() => {
    const fetchArchive = async () => {
      setLoading(true);
      setActiveIndex(0);
      
      let start: string;
      let end: string;

      if (selectedDate) {
        start = selectedDate;
        const endDateObj = new Date(selectedDate);
        endDateObj.setMonth(endDateObj.getMonth() + 6);
        
        const today = new Date();
        end = endDateObj > today ? today.toISOString().split('T')[0] : endDateObj.toISOString().split('T')[0];
      } else {
        const today = new Date();
        start = `${today.getFullYear()}-01-01`;
        end = today.toISOString().split('T')[0];
      }

      try {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`
        );
        const result = await response.json();
        // reverse() to show the most recent in that batch first
        setItems(Array.isArray(result) ? result.reverse() : []);
      } catch (e) {
        console.error("Archive link failure:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchArchive();
  }, [selectedDate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const current = items[activeIndex];

  if (loading) return (
    <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center space-y-10 uppercase italic text-sm text-white tracking-[0.2em]">
      <JellyTriangle
        size="35"
        speed="1.75"
        color="white" 
      />
      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2 }}>
        Fetching Interstellar Data...
      </motion.div>
    </div>
  );

  return (
    <div {...handlers} className="relative h-dvh sm:h-full w-full flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current?.date}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat bg-center transition-transform duration-700"
            style={{ backgroundImage: `url(${current?.hdurl || current?.url})` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/90" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 grow flex flex-col justify-end p-6 sm:px-8">
        <main className="w-full max-w-4xl mb-6 sm:mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="space-y-3 sm:space-y-6"
            >
              <p className="text-[9px] sm:text-xs text-white/90 tracking-widest">
                CAPTURED ON: {current?.date.replace(/-/g, '.')}
              </p>
              <h2 className="text-2xl sm:text-5xl font-light tracking-tight leading-none uppercase italic">
                {current?.title}
              </h2>
              <div className="h-px w-12 sm:w-24 bg-white/30" />
              <p className="text-sm sm:text-base md:text-lg text-white/90 font-light max-w-4xl normal-case line-clamp-3 sm:line-clamp-none">
                {current?.explanation.split('.').slice(0, 2).join('.')}.
              </p>
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="w-full space-y-6">
          <div className="flex items-end justify-between gap-4 ">
            <div className="flex items-center gap-2 text-[9px] text-white/90 tracking-[0.2em]">
              <span className="px-2 py-1 border border-white/90 rounded"><MdOutlineKeyboardArrowLeft/></span>
              <span className="px-2 py-1 border border-white/90 rounded"><MdOutlineKeyboardArrowRight/></span>
              <span className="ml-2 hidden sm:inline uppercase">SWIPE OR USE Keyboard ARROWS TO BROWSE DATA</span>
            </div>
            <div className="text-right">
              <p className="text-[8px] sm:text-[9px] text-white/90 tracking-widest">IMAGE</p>
              <p className="text-sm sm:text-xl font-bold tracking-tighter">
                {String(activeIndex + 1).padStart(3, '0')} <span className="text-white/20">/</span> {String(items.length).padStart(3, '0')}
              </p>
            </div>
          </div>
          <div className="w-full h-px sm:h-0.5 bg-white/10 relative">
            <motion.div 
              className="absolute h-full bg-white shadow-[0_0_15px_white]"
              animate={{ width: `${((activeIndex + 1) / items.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          </div>
        </footer>
      </div>
    </div>
  );
};