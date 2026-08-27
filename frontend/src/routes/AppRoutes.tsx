import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout/AuthLayout';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';

// Pages
import DashboardPage from '../pages/Dashboard/DashboardPage';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import UploadResumePage from '../pages/UploadResume/UploadResumePage';
import JobDescriptionPage from '../pages/JobDescription/JobDescriptionPage';
import AnalysisHistoryPage from '../pages/AnalysisHistory/AnalysisHistoryPage';
import AnalysisDetailPage from '../pages/AnalysisDetail/AnalysisDetailPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import NewAnalysisPage from '../pages/NewAnalysis/NewAnalysisPage';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public-only auth routes (logged-in users get bounced to /dashboard) */}
            <Route element={<PublicOnlyRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Route>

            {/* Protected app routes (unauthenticated users get bounced to /login) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/upload-resume" element={<UploadResumePage />} />
                    <Route path="/job-description" element={<JobDescriptionPage />} />
                    <Route path="/analysis-history" element={<AnalysisHistoryPage />} />
                    <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
                    <Route path="/new-analysis" element={<NewAnalysisPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
