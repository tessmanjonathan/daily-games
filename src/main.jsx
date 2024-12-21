import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TileGame from './TileGame.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <TileGame />
    </StrictMode>
)
