import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './assets/containers/Home'
import RouteInfo from './assets/containers/RouteInfo';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="text-center">
        <RouteInfo />
      </div>
    </QueryClientProvider>
  )
}

export default App
