import './index.css';
import App from './App';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ErrorBoundary from './components/UI Kit/ErrorBoundary'
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import React from 'react'

const queryClient = new QueryClient()

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ErrorBoundary fallback="There has been an error, we have been notified and will be working on fixing it soon.">
                    <App />
                </ErrorBoundary>
                {/* <ReactQueryDevtools/> */}
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);