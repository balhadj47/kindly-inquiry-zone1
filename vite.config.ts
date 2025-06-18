
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-avatar'
          ],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'charts-vendor': ['recharts'],
          'virtualization-vendor': ['react-window'],
          'icons-vendor': ['lucide-react'],
          // Feature chunks
          'companies': [
            './src/components/Companies.tsx',
            './src/components/companies/CompaniesIndex.tsx',
            './src/components/companies/CompanyDetail.tsx'
          ],
          'vans': [
            './src/components/Vans.tsx',
            './src/components/vans/VansIndex.tsx',
            './src/components/vans/VanDetail.tsx'
          ],
          'users': [
            './src/components/Users.tsx',
            './src/components/users/UserGrid.tsx'
          ],
          'trips': [
            './src/components/TripLogger.tsx',
            './src/components/TripHistory.tsx'
          ]
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    sourcemap: mode === 'development',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'lucide-react'
    ],
  },
}));
