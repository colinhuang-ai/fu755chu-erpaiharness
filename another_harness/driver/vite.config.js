// =============================================================
// Cấu hình Vite
// - plugin react(): hỗ trợ JSX + Fast Refresh (sửa code là trình duyệt tự cập nhật)
// - plugin tailwindcss(): Tailwind CSS v4 chạy trực tiếp trong Vite,
//   không cần file tailwind.config.js / postcss.config.js
// =============================================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
