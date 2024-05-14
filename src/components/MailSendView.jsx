import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fleche from '../assets/icone-les-iut.svg';
import RootStore from '../RootStore';

function ModifyMailView() {
  const { t } = useTranslation();
  const { selectedManager, mailManager } = useContext(RootStore);
  async function renvoiMail() {
    const myFormData = new FormData();
    myFormData.append('c', mailManager.adresseMail);
    myFormData.append('cdt', selectedManager.dateEnvoi);
    const res = await fetch(`${APP_ENV_API_PATH}/mail/resend-confirmation`, {
      method: 'POST',
      body: myFormData,
    });
    if (!res.ok) {
      throw new Error("Le traitement ne s'est pas bien effectué");
    }
  }

  function reset() {
    selectedManager.iutSelectionnes.clear();
    selectedManager.iutSelectionnesId.clear();
    selectedManager.butSelectionnes.clear();
    selectedManager.alreadySend = false;
  }

  return (
    <div className="grid gap-24 justify-center">
      <h1 className="text-center text-xl lg:text-4xl">{t('courrielEnvoyeTitre')}</h1>
      <p className="text-center text-3xl">
        {t('courrielEnvoyeTexte1')}
        <br />
        {t('courrielEnvoyeTexte2')}
        <br />
        {selectedManager.iutSelectionnes.size > 1 ? t('courrielEnvoyeTexte3Plur') : t('courrielEnvoyeTexte3')}
      </p>

      <div>
        <button className="border-2 px text-base lg:text-xl p-2" type="button" onClick={renvoiMail}>{t('renvoiMail')}</button>
      </div>
      <div className="grid gap-2 justify-center">
        <Link className="border-2 px-2 text-base lg:text-xl flex justify-center p-2 gap-4" to="/result">
          <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
          <p>{t('courrielEnvoyeRetour1')}</p>
        </Link>
        <Link onClick={() => reset()} className="border-2 px-2 text-base lg:text-xl flex justify-center p-2 gap-4" to="/formation">
          <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
          <p>{t('courrielEnvoyeRetour2')}</p>
        </Link>
      </div>
    </div>
  );
}

export default observer(ModifyMailView);
