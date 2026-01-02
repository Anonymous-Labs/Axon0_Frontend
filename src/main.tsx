import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import { queryClient } from './lib/react-query'
import { config } from './config/environment'
import './index.css'

// Lazy load React Query DevTools in development
const ReactQueryDevtools = config.environment === 'development'
  ? React.lazy(() => import('@tanstack/react-query-devtools').then((d) => ({
      default: d.ReactQueryDevtools,
    })))
  : null

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {ReactQueryDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </React.Suspense>
      )}
    </QueryClientProvider>
  </React.StrictMode>,
)