/* eslint no-param-reassign: ["error", { "props": false }] */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import classNames from 'classnames';

function CaseFormation({ but, className, butManager }) {
  // très lmauvais choix de nom, le nom d'une variable
  // doit toujours apporter une sémantique utile à la compréhension
  const [etat, setEtat] = useState(false);

  function changement() {
    but.getInfo();
    setEtat(!etat);
  }

  function selectionner() {
    butManager.butSelectionnes = but;
  }

  return (
    <div
      id={but.code}
      role="button"
      onClick={changement}
      className={classNames('grid', 'items-center', {
        'col-span-1': etat,
        'col-span-2': !etat,
        'md:col-span-3': !etat,
      })}
      onKeyDown={changement} // Pourquoi un onClick ET un onKeyDown
      // Attention, CaseFormation est répétée dans FormationView,
      // le tabIndex doit être passé en props pour être différent d'un CaseFormation à un autre
      tabIndex={0}
    >
      {etat
        ? (
          <div className="grid gap-y-2 border-2 text-xs  border-blue-900">
            <h2 className={`align-middle text-base text-center ${className}`}>{but.prettyPrintFiliere}</h2>
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
              {` ${but.nom}`}
            </p>
            <div>
              <a className="underline" target="_blank" href={but.urlIUT} rel="noreferrer">en savoir plus</a>
            </div>
            <button className="text-base" onClick={selectionner} type="button">{!butManager.butSelectionnes.has(but) ? 'selectionner' : 'deselectionner'}</button>
          </div>
        )
        : <h2 className={`text-xs align-middle h-full text-center p-2 leading-loose ${className}`}>{but.prettyPrintFiliere}</h2>}
    </div>
  );
}
CaseFormation.propTypes = ({
  but: MPropTypes.objectOrObservableObject.isRequired,
  className: PropTypes.node.isRequired,
  butManager: MPropTypes.observableObject.isRequired,

});
export default observer(CaseFormation);
