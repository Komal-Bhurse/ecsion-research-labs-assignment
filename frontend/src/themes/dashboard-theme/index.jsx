import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'

export default function index() {
  const { pathname } = useLocation()
  console.log(pathname)
  return (
    <>
      <Header/>
      <div className='container pt-3'>
        <p><i className='fa fa-arrow-right' />{" "}{pathname}</p>
        <Outlet />
      </div>
    </>
  )
}
