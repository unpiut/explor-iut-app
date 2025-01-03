import React from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';

function MapModaleExplanation({ onClose }) {
  const { t } = useTranslation();
  return (
    <div className="absolute lg:left-1/2 top-1/3 z-50 ">
      <div className="relative lg:left-[-50%] bg-slate-50 border-2 border-blue-900 text-center justify-center grid">
        <div className="flex gap-2 justify-between p-2">
          <h1 className="text-xl font-bold">{t('carteMETitre')}</h1>
          <button className="text-xl font-bold" type="button" onClick={onClose}>X</button>
        </div>
        <div className="border-t-2 p-2 mt-1 border-blue-800">
          <h3 className="underline-offset-1 font-bold">{t('carteMESousTitre2')}</h3>
          <p>
            {t('carteMETexte2')}
          </p>
          {window.innerWidth >= 1024 ?
          <p>
            {t('carteMETexte3')}
          </p> : null}
          <h3 className="underline-offset-1 font-bold">{t('carteMESousTitre1')}</h3>
          <p>
            {t('carteMETexte1')}
          </p>
        </div>
      </div>
    </div>
  );
}
MapModaleExplanation.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MapModaleExplanation;
