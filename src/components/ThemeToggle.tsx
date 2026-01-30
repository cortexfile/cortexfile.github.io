import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors relative overflow-hidden group"
            whileTap={{ scale: 0.9 }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.5, type: 'spring' }}
            >
                {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-cyber-neon" />
                ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                )}
            </motion.div>

            {/* Glow effect */}
            <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${theme === 'dark' ? 'bg-cyber-neon/20' : 'bg-yellow-400/20'
                }`} />
        </motion.button>
    );
};

export default ThemeToggle;
