// =============================================================
// Cấu hình Vite cho app Quản lý (back-office)
// - react():       hỗ trợ JSX + tự cập nhật khi sửa code
// - tailwindcss(): Tailwind v4, không cần file tailwind.config.js
// Cổng: lấy từ biến môi trường PORT nếu có, mặc định 5175
// (app tài xế dùng 5173), để không đụng các dev server khác.
// =============================================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: Number(process.env.PORT) || 5175 },
})
