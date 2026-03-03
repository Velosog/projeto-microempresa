import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import ChatWidget from './components/ChatWidget'
import ErrorBoundary from './components/ErrorBoundary'
import { ClinicProvider } from './context/ClinicContext'

/**
 * Root application component.
 * Renders the landing page with persistent chat widget,
 * plus a hidden /admin route for template configuration.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ClinicProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <ChatWidget />
                </>
              }
            />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </ClinicProvider>
    </ErrorBoundary>
  )
}
