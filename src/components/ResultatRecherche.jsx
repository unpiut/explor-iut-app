import React, { useContext } from 'react';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import RootStore from '../RootStore';

function ResultatRecherche({ iut, butSlct }) {
  const { selectedManager } = useContext(RootStore);
  return (
    <div key={iut.idIut} className="border border-blue-900 p-5">

      <h2 className="text-center font-bold">{`${iut.nom} - ${iut.site}`}</h2>
      <h2>Formations présentes : </h2>
      {iut.departements.map((but) => (
        butSlct.findIndex((b) => b.code === but.codesButDispenses[0]) >= 0
          ? (
            <h2 key={but.codesButDispenses[0]}>
              {butSlct[butSlct.findIndex((b) => b.code === but.codesButDispenses[0])].nom}
            </h2>
          )
          : null))}
      <p>
        📞 Téléphone :
        {` ${iut.departements[0].tel}`}
      </p>
      <p>
        📧 Mail :
        {` ${iut.departements[0].mel}`}
      </p>
      <button className="p-1 m-2 text-red-800 border border-red-800 rounded w-full text-center" type="button" onClick={() => selectedManager.switchIutSelectionnes(iut)}>Supprimer l&apos;IUT des contacts</button>
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
