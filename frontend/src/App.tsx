import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { AnimatePresence, motion } from 'framer-motion';
import { JellyTriangle } from 'ldrs/react';
import 'ldrs/react/JellyTriangle.css'
import './App.css';

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

function App() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isHeroOpen, setIsHeroOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        if (Array.isArray(result)) {
          setItems(result.reverse());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handleOpenHero = (index: number) => {
    setActiveIndex(index);
    setIsHeroOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col">
      <Header 
        onDateSelect={setSelectedDate} 
        setViewMode={() => setIsHeroOpen(false)} 
      />
      
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-200 px-4 w-auto whitespace-nowrap"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse blur-xl" />
              
              <div className="relative bg-zinc-950/80 backdrop-blur-2xl border border-white/10 px-4 sm:px-6 py-2.5 rounded-full flex items-center gap-3 sm:gap-4 shadow-2xl">
                <JellyTriangle size="12" speed="1.75" color="white" />
                
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  
                  <p className="uppercase italic text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] text-white/90">
                    Fetching Data
                    <span className="hidden xs:inline"> from Archive</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="grow">
        <Gallery 
          items={items} 
          loading={loading && items.length === 0}
          onImageClick={handleOpenHero} 
        />
      </main>

      <AnimatePresence>
        {isHeroOpen && (
          <Hero 
            items={items} 
            activeIndex={activeIndex} 
            setActiveIndex={setActiveIndex} 
            onBack={() => setIsHeroOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;