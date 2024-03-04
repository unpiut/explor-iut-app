import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import RootStore from '../RootStore';

function ResultatRecherche({ iut }) {
  const { iutConserve } = useContext(RootStore);
  return (
    <div>
      <h2>{iut.nom}</h2>
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
      ) : iut.butSelect.map((but) => (
        <div key={but}>
          <h2>{but.filiere}</h2>
          <p>
            Numero de téléphone :
            {but.tel}
          </p>
          <p>
            Mail :
            {but.mel}
          </p>
        </div>
      ))}
    </div>
  );
}
// ResultatRecherche.propTypes({
//   iut: PropTypes.shape({
//     nom: PropTypes.string.isRequired,
//     serviceAlt: PropTypes.shape({
//       tel: PropTypes.string.isRequired,
//       mail: PropTypes.string.isRequired,
//     }),
//     butSelect: PropTypes.shape({
//       but: PropTypes.shape({
//         tel: PropTypes.string.isRequired,
//         mail: PropTypes.string.isRequired,
//       }).isRequired,
//     }).isRequired,
//   }),
// });

export default observer(ResultatRecherche);
