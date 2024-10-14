import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import TestModeFrame from './TestModeFrame';
import RehydrateStatePrompt from './RehydrateStatePrompt';

function Root() {
  return (
    <>
      <RehydrateStatePrompt />
      <AppNavbar />
      <main className="mt-20 mb-32">
        <TestModeFrame>
          <Outlet />
        </TestModeFrame>
      </main>
    </>
  );
}

export default Root;
