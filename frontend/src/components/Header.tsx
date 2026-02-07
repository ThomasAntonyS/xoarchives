import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export const Header = () => {
  return (
    <header className=" fixed top-0 z-20 p-6 sm:px-12 sm:py-4 pb-0">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center"
      >
        <img src={logo} alt="Logo" className="h-5 w-auto object-contain" />
      </motion.div>
    </header>
  );
};