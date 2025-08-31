import { Suspense, useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './route';
import { useAuthStore } from './store/user';
import { ToastContainer } from 'react-toastify';
import { useTrackRoute } from './hooks/useTrackRoute';
import OverallLoading from './pages/OverallLoading';

function AppRoutes() {
  useTrackRoute(); // ✅ now it works because it's inside <BrowserRouter>
  return useRoutes(routes);
}

function App() {
  const { fetchMe, isChecking, ActivationTimer } = useAuthStore();
  
  useEffect(() => {
    fetchMe();
     ActivationTimer();
   
  }, []);
 

  if (isChecking) {
    return (
      <OverallLoading/>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} limit={1} />
      <BrowserRouter>
        <Suspense fallback={<div>loading</div>}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
