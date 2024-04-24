import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fleche from '../assets/icone-les-iut.svg';

function ModifyMailView() {
  const { t } = useTranslation();
  return (
    <div className="grid h-screen">
      <h1 className="text-center text-xl lg:text-3xl">{t('courrielEnvoyeTitre')}</h1>
      <p className="text-center text-xl">
        {t('courrielEnvoyeTexte')}
      </p>
      <form method="GET">

        <div className="grid justify-center">
          <Link className="border-2 p-2 text-base lg:text-xl flex m-2 justify-center gap-4" to="/result">
            <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <p>{t('courrielEnvoyeRetour1')}</p>
          </Link>
          <Link className="border-2 p-2 text-base lg:text-xl flex m-2 justify-center gap-4" to="/formation">
            <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <p>{t('courrielEnvoyeRetour2')}</p>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default observer(ModifyMailView);
