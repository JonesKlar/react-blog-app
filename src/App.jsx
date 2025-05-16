import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router'; // React Router for navigation
import Header from './components/Header.jsx'; // Header component
import Footer from './components/Footer.jsx'; // Footer component
import HomePage from './pages/HomePage.jsx'; // Home page component
import ArticlePage from './pages/ArticlePage.jsx'; // Article details page component
import LoginPage from './pages/LoginPage.jsx'; // Login page component
import { AuthProvider } from './context/AuthContext.jsx'; // Context provider for authentication
import AdminCommentModerationPage from './pages/AdminCommentModerationPage.jsx'; // Admin page for comment moderation
import RegisterPage from './pages/RegisterPage.jsx'; // Registration page component
import NotFound from './pages/NotFound.jsx'; // 404 Not Found page component
import { ToastContainer } from 'react-toastify'; // Toast notifications for user feedback
import ScrollToTopBadge from './components/ScrollToTopBadge.jsx'; // Scroll-to-top badge component
import { ConfigProvider } from './context/ConfigContext.jsx';

// json-server --watch db.json --port 5000
// Command to start a JSON server for development purposes

function App() {
  console.log('React läuft'); // Debugging log to confirm the app is running

  return (
    <ConfigProvider>
      <AuthProvider>
        {/* Provide authentication context to the entire app */}
        <Router>
          {/* React Router to handle navigation */}
          <Header />
          {/* Header component displayed on all pages */}
          <main className="container mx-auto px-4 py-6">
            {/* Main content area with padding and responsive container */}
            <Routes>
              {/* Define routes for the application */}
              <Route path="/" element={<HomePage />} />
              {/* Route for the home page */}
              <Route path="/article/:id" element={<ArticlePage />} />
              {/* Route for viewing a specific article */}
              <Route path="/login" element={<LoginPage />} />
              {/* Route for the login page */}
              <Route path="/register" element={<RegisterPage />} />
              {/* Route for the registration page */}
              <Route path="/admin/comments" element={<AdminCommentModerationPage />} />
              {/* Route for the admin comment moderation page */}
              <Route path="*" element={<NotFound />} />
              {/* Catch-all route for undefined paths, displays the NotFound page */}
            </Routes>
          </main>
          <Footer />
          {/* Footer component displayed on all pages */}
        </Router>
        <ToastContainer
          position="top-right" // Position of the toast notifications
          autoClose={1500} // Auto-close duration in milliseconds
          hideProgressBar={false} // Show the progress bar
          newestOnTop={false} // Display newest notifications at the bottom
          closeOnClick // Close notifications on click
          pauseOnHover // Pause auto-close on hover
          theme="light" // Light theme for the notifications
        />
        <ScrollToTopBadge />
        {/* Component to display a badge for scrolling to the top */}
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
