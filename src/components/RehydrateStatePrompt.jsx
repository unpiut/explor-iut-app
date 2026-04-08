import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import ModaleRehydrateState from './ModaleRehydrateState';
import RootStore from '../RootStore';

// Routes où la modale ne doit pas s'afficher
const EXCLUDED_ROUTES = ['/admin', '/mentions', '/validate', '/mailSend'];

function RehydrateStatePrompt() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stateSaver } = useContext(RootStore);
  const [showRehydratModal, setShowRehydratModal] = useState(stateSaver.canRehydrate);

  // Vérifier si la route actuelle est exclue
  const isExcludedRoute = EXCLUDED_ROUTES.includes(location.pathname);

  useEffect(() => {
    // Ne mettre à jour la modale que si la route n'est pas exclue
    if (!isExcludedRoute && stateSaver.canRehydrate !== showRehydratModal) {
      setShowRehydratModal(stateSaver.canRehydrate);
    }
  }, [showRehydratModal, stateSaver, stateSaver.canRehydrate, isExcludedRoute]);

  const confirmRehydratation = () => {
    stateSaver.rehydrate().then(({ hasButs, hasIuts }) => {
      if (location.pathname !== '/') {
        // do not redirect if a specif url has been given
        return;
      }
      if (hasButs) {
        if (hasIuts) {
          navigate('/map');
        }
        else {
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

  if (isExcludedRoute) {
    return null;
  }

  return showRehydratModal && (
    <ModaleRehydrateState
      onConfirm={confirmRehydratation}
      onCancel={cancelRehydratation}
    />
  );
}

export default observer(RehydrateStatePrompt);
