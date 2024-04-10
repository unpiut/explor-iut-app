import React, { useState } from 'react';
import { PropTypes } from 'mobx-react';
import classNames from 'classnames';
import { PropTypes as MPropTypes } from 'prop-types';
import fleche from '../assets/icone-les-iut.svg';

function FicheRappelIut({ but, index }) {
  const [developpement, setDeveloppement] = useState(false);
  return (
    <div key={index}>
      <button className="grid grid-cols-2 justify-items-center w-full justify-around align-middle border-t-2 border-blue-900" key={but.code} type="button" value={but.code} onClick={() => setDeveloppement(!developpement)}>
        <p>
          {but.prettyPrintFiliere}
        </p>
        <img src={fleche} width={25} alt="dropdown" />
      </button>
      <div
        className={classNames('grid', 'gap-y-2', 'border-t-2', 'text-xs', 'border-blue-900', {
          hidden: !developpement,
        })}
      >
        <p className="font-bold text-sm">
          Titre académique de la formation :
          {` ${but.nom} (${but.code})`}
        </p>
        <p className="font-bold">
          Description formation :
        </p>
        <p>
          {but.description ? ` ${but.description}` : ''}
        </p>
        <div>
          <p className="font-bold">
            Les spécialités :
          </p>
          {but.parcours.map((parcours) => (
            <p key={parcours[0]}>
              {' '}
              { parcours[1]}
              {parcours !== but.parcours[but.parcours.length - 1] ? ',' : null}
            </p>
          ))}
        </div>
        <p className="font-bold">
          Débouchés métiers :
        </p>
        <p>
          {but.metiers ? ` ${but.metiers}` : ''}
        </p>
      </div>
    </div>
  );
}
FicheRappelIut.propTypes = {
  but: PropTypes.objectOrObservableObject.isRequired,
  index: MPropTypes.number.isRequired,
};
export default FicheRappelIut;
