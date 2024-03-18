import React from 'react';
import { observer, PropTypes as MPropTypes } from 'mobx-react';

function ResultatRecherche({ iut, butSlct }) {
  return (
    <div className="border border-blue-900 pb-10">
      <h2>{`${iut.nom} - ${iut.site}`}</h2>
      {iut.serviceAlt ? (
        <div>
          <h2>Service Alternance</h2>
          <p>
            Numéro de téléphone : $
            {iut.serviceAlt.tel}
          </p>
          <p>
            Mail : $
            {iut.serviceAlt.mel}
          </p>
        </div>
      ) : iut.departements.map((but) => (
        butSlct.findIndex((b) => b.code === but.codesButDispenses[0]) >= 0
          ? (
            <div key={iut.idIut + but.code}>
              <h2>{butSlct[butSlct.findIndex((b) => b.code === but.codesButDispenses[0])].nom}</h2>
              <p>
                Numero de téléphone :
                {but.tel}
              </p>
              <p>
                Mail :
                {but.mel}
              </p>
            </div>
          )
          : null))}
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
