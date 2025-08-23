import React from 'react'
import SideNav from '../components/SideNav'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <>
    <div className='w-full h-[100vh] bg-[var(--primary-bg)] text-[var(--text)] flex'>
        <div className='w-[10%]'>

      <SideNav/>
        </div>
      <div className='w-[89%] p-2 overflow-y-scroll'>
        <Outlet></Outlet>
      </div>
    </div>
    </>
  )
}

export default Home