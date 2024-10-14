import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import RootStore from '../RootStore';

function ValidateView() {
  const { t } = useTranslation();
  const { stateSaver } = useContext(RootStore);
  const [queryParam] = useSearchParams();
  const [processing, setProcessing] = useState({ processing: true, error: null });

  useEffect(() => {
    // Hide rehydratation prompt
    stateSaver.rehydrationPromptHidden = true;
    // Attempt to retrieve token then validate it
    const token = queryParam.get('t');
    if (!token) {
      setProcessing({ processing: false, error: 'Absence de token' });
    } else {
      fetch(`${APP_ENV_API_PATH}/mail/validate`, {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({ token }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Le traitement ne s'est pas bien effectué");
          }
          // Clear rehydration state
          stateSaver.clearSavedState();
          // Remove processing indicator
          setProcessing({ processing: false, error: null });
        }).catch(() => {
          setProcessing({ processing: false, error: "Le traitement ne s'est pas bien effectué" });
        });
    }
    return () => {
      // Unhide rehydratation prompt if any
      stateSaver.rehydrationPromptHidden = false;
    };
  }, []);

  return (
    <div className="grid gap-24 justify-center">
      <h1 className="text-center text-xl lg:text-4xl mt-5">{t('titleMailValidate')}</h1>
      <p className="text-center text-base lg:text-3xl">
        {t('textMailValidate')}
      </p>
      <p className="text-center text-base">
        {processing.processing}
        {' '}
        {processing.error}
      </p>
    </div>
  );
}

export default observer(ValidateView);
