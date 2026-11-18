// =============================================================
// supabase.js — Tạo kết nối (client) tới Supabase, dùng chung cho cả app
//
// URL và key đọc từ file .env.local (xem .env.example):
//   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
//   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
//
// Nếu thiếu biến môi trường → export null. Lớp service (services/attendanceService.js)
// sẽ thấy null và tự dùng dữ liệu mẫu, nên app vẫn chạy được khi chưa cấu hình.
// =============================================================
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Chỉ tạo client khi có đủ cả URL và key
export const supabase = url && publishableKey ? createClient(url, publishableKey) : null

if (!supabase) {
  console.warn('[supabase] Thiếu VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY → dùng dữ liệu mẫu.')
}
