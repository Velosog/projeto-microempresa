import Home from './pages/Home'
import ChatWidget from './components/ChatWidget'

/**
 * Root application component.
 * Renders the landing page and the persistent chat widget overlay.
 */
export default function App() {
  return (
    <>
      <Home />
      <ChatWidget />
    </>
  )
}
