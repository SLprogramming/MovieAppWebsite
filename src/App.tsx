import { Suspense, useEffect } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './route';
import { useAuthStore } from './store/user';
import { ToastContainer } from 'react-toastify';
import { useTrackRoute } from './hooks/useTrackRoute';
import OverallLoading from './pages/OverallLoading';
import { useContentStore } from './store/content';
import { usePurchaseStore } from './store/purchase';
import { useUserPurchaseRequests } from './socket';

function AppRoutes() {
  useTrackRoute(); // ✅ now it works because it's inside <BrowserRouter>
  return useRoutes(routes);
}

function App() {
  const { fetchMe, isChecking, ActivationTimer,user } = useAuthStore();
   const {fetchGenres} = useContentStore()
    const {fetchPlans,fetchPlatforms,fetchPurchaseRequest} = usePurchaseStore()

    
    useUserPurchaseRequests(user?._id || null,() => console.log('new'),(e) => {
      console.log(e)
      if(e=='inquiry'){
        fetchMe({checking:false})
        fetchPurchaseRequest(user?._id as string)
      }
    })
    
  useEffect(() => {
    fetchMe({checking:true});
    fetchGenres()
     ActivationTimer();
  
      fetchPlans();
    
   
      fetchPlatforms();
   
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
