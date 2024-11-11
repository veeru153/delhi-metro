import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { searchingStationAtom } from './common/atoms';
import StationPicker from './components/StationPicker';
import Home from './containers/Home';
import Map from './containers/Map';
import RouteInfo from './containers/RouteInfo';

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
      <HashRouter>
        <div className="text-center max-w-[640px] mx-auto">
          <StationPicker stationAtom={searchingStation} />
          <Routes>
            <Route path="/route" element={<RouteInfo />} />
            <Route path="/map" element={<Map />} />
            <Route path="/raw-map/" element={<Map hideTopBar />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </HashRouter>
    </QueryClientProvider>
  )
}

export default App
