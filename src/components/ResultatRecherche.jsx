import React from 'react';
import { observer, PropTypes as MPropTypes } from 'mobx-react';

function ResultatRecherche({ iut, butSlct }) {
  return (
    <div>
      {iut.serviceAlt ? (
        <div className="border border-blue-900 pb-10">
          <h2>{`${iut.nom} - ${iut.site}`}</h2>
          <h3>Service Alternance</h3>
          <p>
            Téléphone : $
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
            <div key={iut.idIut + but.code} className="border border-blue-900 pb-10">
              <h2 className="text-center font-bold">{`${iut.nom} - ${iut.site}`}</h2>
              <h2>{butSlct[butSlct.findIndex((b) => b.code === but.codesButDispenses[0])].nom}</h2>
              <p>
                📞 Téléphone :
                {but.tel}
              </p>
              <p>
                📧 Mail :
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
