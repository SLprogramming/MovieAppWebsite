import { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './route';
import { useAuthStore } from './store/user';

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
