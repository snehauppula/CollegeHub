import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import EventsPage from './pages/EventsPage';
import CollaborationPage from './pages/CollaborationPage';
import LoginPage from './pages/LoginPage';
import OrganizerLoginPage from './pages/OrganizerLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import AlumniEmailPage from './pages/AlumniEmailPage';

import CreateEventPage from './pages/CreateEventPage';
import ProjectsPage from './pages/ProjectsPage';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/create" element={<CreateEventPage />} />
        <Route path="/events/manage" element={<EventsPage />} />
        <Route path="/collaboration" element={<CollaborationPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/organizer-login" element={<OrganizerLoginPage />} />
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/alumni/email" element={<AlumniEmailPage />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;