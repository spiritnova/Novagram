import './index.css';
import App from './App';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from 'react'

const queryClient = new QueryClient()

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);