import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Upload,
    FileText,
    History,
    User,
    LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.scss';

interface SidebarProps {
    mobileOpen?: boolean;
    closeMobile?: () => void;
}

const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/upload-resume', label: 'Upload Resume', icon: Upload },
    { to: '/job-description', label: 'Job Description', icon: FileText },
    { to: '/analysis-history', label: 'Analysis History', icon: History },
    { to: '/profile', label: 'Profile', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, closeMobile }) => {
    const { logout } = useAuth();

    const handleLogout = () => {
        closeMobile?.();
        logout();
    };

    return (
        <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ''}`}>
            <div className={styles.brand}>ResumeAI</div>

            <nav className={styles.nav}>
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={closeMobile}
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.active : ''}`
                        }
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className={styles.navBottom}>
                <button className={styles.link} onClick={handleLogout} style={{ width: '100%' }}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};
