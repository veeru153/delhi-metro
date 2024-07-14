import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './containers/Home'
import RouteInfo from './containers/RouteInfo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { searchingStationAtom } from './common/atoms';
import StationPicker from './components/StationPicker';
import Map from './containers/Map';

/// <reference types="vite-plugin-svgr/client" />

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
      <BrowserRouter basename='/delhi-metro'>
        <div className="text-center max-w-[640px] mx-auto">
          <StationPicker stationAtom={searchingStation} />
          <Routes>
            <Route path="/route" element={<RouteInfo />} />
            <Route path="/map" element={<Map />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
