import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import EventsPage from './pages/EventsPage';
import CollaborationPage from './pages/CollaborationPage';
import OrganizerLoginPage from './pages/OrganizerLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import AlumniEmailPage from './pages/AlumniEmailPage';
import AlumniLinkedInPage from './pages/AlumniLinkedInPage';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/collaboration" element={<CollaborationPage />} />
        <Route path="/organizer-login" element={<OrganizerLoginPage />} />
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/alumni/email" element={<AlumniEmailPage />} />
        <Route path="/alumni/linkedin" element={<AlumniLinkedInPage />} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;