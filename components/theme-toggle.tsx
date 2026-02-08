'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-provider';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />;
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full w-10 h-10 bg-background/50 backdrop-blur-sm border-border hover:bg-muted transition-colors"
                aria-label="Toggle Theme"
            >
                <motion.div
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    key={theme}
                >
                    {theme === 'dark' ? (
                        <Moon className="w-5 h-5 text-primary" />
                    ) : (
                        <Sun className="w-5 h-5 text-primary" />
                    )}
                </motion.div>
            </Button>
        </motion.div>
    );
}
