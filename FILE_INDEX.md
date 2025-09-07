# CollegeHub Project - File Index

## Project Overview
CollegeHub is a React-based web application built with TypeScript, Vite, and Tailwind CSS. The project appears to be a platform for college students, alumni, and event organizers with features including authentication, event management, collaboration tools, and alumni networking.

## Root Directory Files

### Configuration Files
- **`package.json`** (903B) - Project dependencies and scripts
- **`package-lock.json`** (155KB) - Locked dependency versions
- **`tsconfig.json`** (126B) - TypeScript compiler configuration
- **`tsconfig.app.json`** (576B) - App-specific TypeScript config
- **`tsconfig.node.json`** (501B) - Node.js TypeScript config
- **`vite.config.ts`** (230B) - Vite build tool configuration
- **`tailwind.config.js`** (178B) - Tailwind CSS configuration
- **`postcss.config.js`** (87B) - PostCSS configuration
- **`eslint.config.js`** (767B) - ESLint code quality rules

### Documentation & Entry Points
- **`README.md`** (12B) - Project documentation
- **`index.html`** (408B) - Main HTML entry point
- **`.gitignore`** (283B) - Git ignore patterns

### Directories
- **`.git/`** - Git version control data
- **`.bolt/`** - Bolt-related configuration/data
- **`src/`** - Source code directory

## Source Code (`src/`)

### Core Application Files
- **`main.tsx`** (340B) - Application entry point and React rendering
- **`App.tsx`** (1.1KB) - Main application component and routing
- **`index.css`** (62B) - Global CSS styles
- **`vite-env.d.ts`** (39B) - Vite environment type definitions

### Components (`src/components/`)
- **`Layout.tsx`** (2.2KB) - Main layout wrapper component
- **`HomePage.tsx`** (12KB) - Landing page component
- **`Chatbot.tsx`** (7.8KB) - Chatbot functionality component

### Pages (`src/pages/`)
- **`StudentLoginPage.tsx`** (5.3KB) - Student authentication page
- **`OrganizerLoginPage.tsx`** (4.8KB) - Event organizer authentication page
- **`EventsPage.tsx`** (6.0KB) - Events listing and management page with Google Sheets integration
- **`CollaborationPage.tsx`** (13KB) - Collaboration tools and features page
- **`AlumniLinkedInPage.tsx`** (11KB) - Alumni LinkedIn integration page
- **`AlumniEmailPage.tsx`** (13KB) - Alumni email management page

### Utilities (`src/utils/`)
- **`sheetsApi.ts`** (2.1KB) - Google Sheets API integration utilities for fetching events data

## Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: npm
- **Code Quality**: ESLint
- **CSS Processing**: PostCSS
- **Data Source**: Google Sheets API integration

## Key Features
Based on the file structure, this application includes:
1. **Authentication System** - Separate login flows for students and organizers
2. **Event Management** - Events page for organizing and viewing events with real-time Google Sheets integration
3. **Collaboration Tools** - Platform for student collaboration
4. **Alumni Network** - LinkedIn integration and email management for alumni
5. **Chatbot** - AI-powered assistance
6. **Google Sheets Integration** - Live data management via Sheets API for events

## Google Sheets Integration
- **Events Data Source**: [Google Sheets](https://docs.google.com/spreadsheets/d/1JTee6s9iILn_dz8zd4IlMWINiYF4Z5yqQyP7Y8eheMU/edit?usp=sharing)
- **Data Structure**: Club name, Event name, Event date, Event venue, Fee, Gmail, phone, join link
- **Real-time Updates**: Events are automatically fetched and displayed from the spreadsheet
- **CSV Export**: Uses Google Sheets CSV export functionality for data retrieval

## File Size Summary
- **Largest Files**: `CollaborationPage.tsx` and `AlumniEmailPage.tsx` (13KB each)
- **Medium Files**: `HomePage.tsx` (12KB), `AlumniLinkedInPage.tsx` (11KB)
- **Smaller Files**: `Chatbot.tsx` (7.8KB), `EventsPage.tsx` (6.0KB)
- **Configuration**: Various config files ranging from 39B to 767B

## Development Notes
- The project uses modern React patterns with TypeScript
- Tailwind CSS for utility-first styling
- Vite for fast development and building
- ESLint for code quality enforcement
- Google Sheets API integration provides real-time event data
- Events page displays fee information, contact details, and venue information
- Responsive design with loading states and error handling
