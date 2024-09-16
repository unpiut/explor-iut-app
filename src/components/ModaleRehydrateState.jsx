import React from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';

function ModaleRehydrateState({ onConfirm, onCancel }) {
  const { t } = useTranslation();
  return (
    <div className="absolute lg:left-1/2 top-1/3 z-50 ">
      <div className="relative lg:left-[-50%] bg-slate-50 border-2 border-blue-900 text-center justify-center grid">
        <div className="flex gap-2 justify-between p-2">
          <h1 className="text-xl font-bold">{t('repriseNavigationTitre')}</h1>
          <button className="text-xl font-bold" type="button" onClick={onCancel}>X</button>
        </div>
        <div className="border-t-2 p-2 mt-1 border-blue-800">
          <h3 className="underline-offset-1 font-bold">{t('carteMESousTitre2')}</h3>
          <p>
            {t('repriseNavigationQuestion')}
          </p>
          <p>
            <button
              onClick={onCancel}
              type="button"
              className="max-w-full break-words text-xs p-1 m-2 md:text-base align-middle text-center border-2 border-black` bg-contain font-bold"
            >
              {t('repriseNavigationAnnulation')}
            </button>
            <button
              onClick={onConfirm}
              type="button"
              className="max-w-full break-words text-xs p-1 m-2 md:text-base align-middle text-center border-2 border-blue-900 bg-contain font-bold"
            >
              {t('repriseNavigationConfirmation')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
ModaleRehydrateState.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ModaleRehydrateState;
