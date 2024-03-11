import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

function CaseFormation({ but, className, butManager }) {
  const [etat, setEtat] = useState(false);
  const {
    filiere, code, nom,
  } = but;
  const url = nom.replaceAll(' ', '-').replaceAll("'", '').replaceAll(/[éèêë]/g, 'e');
  function changement() {
    but.getInfo();
    const div = document.getElementById(code);
    if (etat) {
      div.classList.add('col-span-1');
      div.classList.remove('col-span-2');
      div.classList.remove('md:col-span-3');
    } else {
      div.classList.add('col-span-2');
      div.classList.add('md:col-span-3');
      div.classList.remove('col-span-1');
    }
    setEtat(!etat);
  }
  function selectionner() {
    butManager.butSelectionnes = but;
  }

  return (
    <div id={code} role="button" onClick={changement} className="grid items-center" onKeyDown={changement} tabIndex={0}>
      {etat
        ? (
          <div className="grid gap-y-2 border-2 text-xs  border-blue-900">
            <h2 className={`align-middle text-base text-center ${className}`}>{filiere.replaceAll('Métiers ', '').replaceAll(/de |d'|du |l'|la |en |l’/g, '')}</h2>
            <p>
              Description formation :
              {but.description ? ` ${but.description}` : ''}
            </p>
            <p>
              Parcours disponible :
              {but.parcours.map((parcours) => (
                <>
                  {' '}
                  { parcours[1]}
                  {parcours !== but.parcours[but.parcours.length - 1] ? ',' : null}
                </>
              ))}
            </p>
            <p>
              Débouchés métiers :
              {but.metiers ? ` ${but.metiers}` : ''}
            </p>
            <p>
              Formation :
              {` ${nom}`}
            </p>
            <div>
              <a className="underline" target="_blank" href={`https://www.iut.fr/bachelor-universitaire-de-technologie/${url}/`} rel="noreferrer">en savoir plus</a>
            </div>
            <button className="text-base" onClick={selectionner} type="button">{!butManager.butSelectionnes.has(but) ? 'selectionner' : 'deselectionner'}</button>
          </div>
        )
        : <h2 className={`text-xs align-middle h-full text-center p-2 leading-loose ${className}`}>{filiere.replaceAll('Métiers ', '').replaceAll(/de |d'|du |l'|la |en |l’/g, '')}</h2>}
    </div>
  );
}
CaseFormation.propTypes = ({
  but: PropTypes.shape({
    filiere: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    metiers: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    description: PropTypes.string,
    getInfo: PropTypes.func,
    parcours: PropTypes.shape({
      length: PropTypes.number,
      map: PropTypes.func,
    }),
  }).isRequired,
  className: PropTypes.string.isRequired,

});
export default observer(CaseFormation);
