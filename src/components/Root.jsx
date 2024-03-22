import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar';

function Root() {
  return (
    <>
      <AppNavbar />
      <main className="mt-20">
        <Outlet />
      </main>
    </>
  );
}

export default Root;
