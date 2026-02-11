import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <div className="relative h-dvh sm:h-screen w-full bg-black text-white overflow-hidden touch-none flex flex-col">
      <Header onDateSelect={setSelectedDate} />
      <Hero selectedDate={selectedDate} />
    </div>
  );
}

export default App;