import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './assets/containers/Home'
import RouteInfo from './assets/containers/RouteInfo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { searchingStationAtom } from './assets/common/atoms';
import StationPicker from './assets/components/StationPicker';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 300000,
    }
  }
});

function App() {
  const searchingStation = useAtomValue(searchingStationAtom);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StationPicker stationAtom={searchingStation} />
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
