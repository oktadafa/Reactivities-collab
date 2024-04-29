import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'react-calendar/dist/Calendar.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/router.tsx'
import { Store, StoreContext } from './app/store/store.ts'
import {  QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
const queryClient =new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreContext.Provider value={Store}>
      <QueryClientProvider client={queryClient}> 
        <RouterProvider router={router}/>
        <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
    </StoreContext.Provider>
  </React.StrictMode>,
)
