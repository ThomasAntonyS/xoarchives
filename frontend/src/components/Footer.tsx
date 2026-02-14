import logo from '../assets/logo.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/50 bg-black px-6 py-10 sm:px-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-3 w-auto object-contain brightness-200 opacity-80 hover:opacity-100 transition-opacity" 
          />
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1">
          <p className="text-[10px] tracking-[0.15em] uppercase text-white/80">
            &copy; {currentYear} All Rights Reserved
          </p>
          <p className="text-[8px] tracking-widest text-white/80 uppercase">
            Data provided by NASA APOD API
          </p>
        </div>

      </div>
    </footer>
  );
};