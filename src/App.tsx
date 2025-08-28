import { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './route';
import { useAuthStore } from './store/user';
import { ToastContainer } from 'react-toastify';

function AppRoutes() {
 return useRoutes(routes);
}


function App() {
  const {fetchMe,isChecking,ActivationTimer} = useAuthStore()

  useEffect(() => {
    fetchMe()
    ActivationTimer()
  },[])


  if(isChecking){
    return (
      <>
       
      <div className='w-full h-[100vh] bg-[var(--primary-bg)]'>
        my loading
      </div>
      </>
    )
  }

  return (
    <>
       <ToastContainer position='top-center' autoClose={2000} limit={1}/>
     <div>
      <BrowserRouter>
      <Suspense fallback={<div>loading</div>}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
     </div>
 
    </>
  )
}

export default App
