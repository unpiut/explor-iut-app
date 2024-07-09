import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function ValidateView() {
  const [queryParam] = useSearchParams();
  const [processing, setProcessing] = useState({ processing: true, error: null });
  useEffect(() => {
    const token = queryParam.get('t');
    if (!token) {
      setProcessing({ processing: false, error: 'Absence de token' });
      return;
    }
    fetch(`${APP_ENV_API_PATH}/mail/validate`, {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Le traitement ne s'est pas bien effectué");
        }
        setProcessing({ processing: false, error: null });
      }).catch(() => {
        setProcessing({ processing: false, error: "Le traitement ne s'est pas bien effectué" });
      });
  }, []);
  return (
    <h1>
      Votre mail a bien été envoyé !
      {processing.processing}
      {' '}
      {processing.error}
    </h1>
  );
}

export default observer(ValidateView);
