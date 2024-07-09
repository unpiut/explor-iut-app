import React, { useContext } from 'react';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import RootStore from '../RootStore';

function ResultatRecherche({ iut, butSlct }) {
  const { t } = useTranslation();
  const { selectedManager } = useContext(RootStore);
  return (
    <div key={iut.idIut} className="border border-blue-900 p-5">

      <h2 className="text-center font-bold">{`${iut.nom} - ${iut.site}`}</h2>
      <h2>{t('recapCaseFormation')}</h2>
      {iut.departements.map((but) => (
        butSlct.findIndex((b) => b.code === but.butDispenses[0].codeBut) >= 0
          ? (
            <h2 key={but.butDispenses[0].codeBut}>
              {butSlct[butSlct.findIndex((b) => b.code === but.butDispenses[0].codeBut)].nom}
            </h2>
          )
          : null))}
      <p>
        📞 Téléphone :
        {` ${iut.tel}`}
      </p>
      <p>
        📧 Mail :
        {` ${iut.mel}`}
      </p>
      <button className="p-1 m-2 text-red-800 border border-red-800 rounded w-full text-center" type="button" onClick={() => selectedManager.switchIutSelectionnes(iut)}>{t('recapCaseSupp')}</button>
    </div>
  );
}
ResultatRecherche.propTypes = ({
  iut: MPropTypes.objectOrObservableObject,
  butSlct: MPropTypes.arrayOrObservableArray.isRequired,
});
ResultatRecherche.defaultProps = ({
  iut: null,
});

export default observer(ResultatRecherche);
