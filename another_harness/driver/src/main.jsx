// =============================================================
// main.jsx — Điểm khởi động của ứng dụng React
// Vite nạp file này từ index.html, sau đó React "gắn" <App /> vào thẻ #root.
// =============================================================
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // CSS toàn cục + Tailwind + design tokens
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // StrictMode: chỉ chạy ở môi trường dev, giúp phát hiện lỗi tiềm ẩn sớm
  <StrictMode>
    <App />
  </StrictMode>,
)
