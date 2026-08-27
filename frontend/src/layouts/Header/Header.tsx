import React from 'react';
import { Menu, Moon, Sun, UserCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.scss';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button className={styles.hamburger} onClick={onMenuClick} aria-label="Open menu">
                    <Menu size={22} />
                </button>
            </div>

            <div className={styles.right}>
                <button
                    onClick={toggleTheme}
                    className={styles.themeToggle}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div className={styles.userInfo}>
                    <UserCircle size={22} />
                    <span>{user?.name ?? 'Account'}</span>
                </div>
            </div>
        </header>
    );
};
