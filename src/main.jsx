import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GameLauncher from './GameLauncher.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GameLauncher />
    </StrictMode>
)
