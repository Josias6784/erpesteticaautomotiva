import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Root from './Root.jsx'

const root = document.getElementById('root')

// Global error catcher for debugging
window.onerror = (msg, src, line, col, err) => {
  console.error('Global error:', msg, err)
}

createRoot(root).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
