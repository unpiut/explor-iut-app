import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import ModaleRehydrateState from './ModaleRehydrateState';
import RootStore from '../RootStore';

function RehydrateStatePrompt() {
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

  return showRehydratModal && (
    <ModaleRehydrateState
      onConfirm={confirmRehydratation}
      onCancel={cancelRehydratation}
    />
  );
}

export default observer(RehydrateStatePrompt);
