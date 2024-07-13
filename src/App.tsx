import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './assets/containers/Home'
import RouteInfo from './assets/containers/RouteInfo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 300000,
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="text-center">
          <Routes>
            <Route path="/route" element={<RouteInfo />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
