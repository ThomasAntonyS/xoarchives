import { Header } from './components/Header';
import { Hero } from './components/Hero';
import './App.css';

function App() {
  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden touch-none flex flex-col">
      <Header />
      <Hero />
    </div>
  );
}

export default App;