import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ShonenHQ from './ShonenHQ.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShonenHQ />
  </StrictMode>,
)
