"use client";
import styles from './ThemePopUp.module.css';
import { useEffect, useState } from "react";
import { GoSun, GoMoon } from 'react-icons/go';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        // Используем classList вместо className для избежания конфликтов с Next.js классами
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(savedTheme);
    }, []);
    
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        // Используем classList вместо className для избежания конфликтов с Next.js классами
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
    };
    
    return (
        <button 
            className={styles.themeToggleButton} 
            onClick={toggleTheme}
            aria-label={theme === 'light' ? "Переключить на темную тему" : "Переключить на светлую тему"}
        >
            {theme === 'light' ? <GoSun className={styles.whitetheme} /> : <GoMoon className={styles.darktheme} />}
        </button>
    );
}


