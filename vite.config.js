import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from "dotenv"

export default defineConfig({
    plugins: [react()],
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_KEY': JSON.stringify(process.env.VITE_SUPABASE_KEY),
      'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID),
      'process.env.VITE_GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_SECRET),
      'process.env.VITE_VITE_CLOUD_NAME': JSON.stringify(process.env.VITE_VITE_CLOUD_NAME),
      'process.env.VITE_VITE_API_KEY': JSON.stringify(process.env.VITE_VITE_API_KEY),
      'process.env.VITE_VITE_API_SECRET': JSON.stringify(process.env.VITE_VITE_API_SECRET)
    },
});
