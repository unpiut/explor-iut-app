import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import RootStore from '../RootStore';
import ModaleRehydrateState from './ModaleRehydrateState';
import TestModeFrame from './TestModeFrame';

function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stateSaver } = useContext(RootStore);
  const [showRehydratModal, setShowRehydratModal] = useState(stateSaver.canRehydrate);

  useEffect(() => {
    if (stateSaver.canRehydrate !== showRehydratModal) {
      setShowRehydratModal(stateSaver.canRehydrate);
    }
  }, [stateSaver, stateSaver.canRehydrate]);

  const confirmRehydratation = () => {
    stateSaver.rehydrate().then(({ hasButs, hasIuts }) => {
      if (location.pathname !== '/') {
        // do not redirect if a specif url has been given
        return;
      }
      if (hasButs) {
        if (hasIuts) {
          navigate('/map');
        } else {
          navigate('/formation');
        }
      }
    });
    setShowRehydratModal(false);
  };

  const cancelRehydratation = () => {
    stateSaver.cancelRehydratation();
    setShowRehydratModal(false);
  };

  return (
    <>
      {showRehydratModal && (
      <ModaleRehydrateState
        onConfirm={confirmRehydratation}
        onCancel={cancelRehydratation}
      />
      )}
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
