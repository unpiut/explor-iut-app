import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar';

function Root() {
  return (
    <>
      <AppNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Root;
