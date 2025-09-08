import { Suspense, useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './route';
import { useAuthStore } from './store/user';
import { ToastContainer } from 'react-toastify';
import { useTrackRoute } from './hooks/useTrackRoute';
import OverallLoading from './pages/OverallLoading';
import { useContentStore } from './store/content';

function AppRoutes() {
  useTrackRoute(); // ✅ now it works because it's inside <BrowserRouter>
  return useRoutes(routes);
}

function App() {
  const { fetchMe, isChecking, ActivationTimer } = useAuthStore();
   const {fetchGenres} = useContentStore()
    
  

  useEffect(() => {
    fetchMe();
    fetchGenres()
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
