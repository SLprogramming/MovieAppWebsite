import { Suspense, useState } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './route';


function AppRoutes() {
 return useRoutes(routes);
}


function App() {
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
