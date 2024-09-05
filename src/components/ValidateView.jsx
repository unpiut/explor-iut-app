import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

function ValidateView() {
  const { t } = useTranslation();
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
