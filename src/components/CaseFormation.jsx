/* eslint no-param-reassign: ["error", { "props": false }] */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import classNames from 'classnames';
import RootStore from '../RootStore';
import style from './CaseFormationjsx.css';

function CaseFormation({
  but, className, tabIndex,
}) {
  const [etat, setEtat] = useState(false);
  const { butManager, iutManager } = useContext(RootStore);
  const maClasse = style[`bg-${but.code}`] ?? style['bg-DEFAULT']; // On charge la classe 'version js' de nom bg-codeBUT ou bg-DEFAULT si la classe précédente n'existe pas
  function changement() {
    but.getInfo();
    setEtat(!etat);
  }

  function selectionner() {
    butManager.switchButSelectionne(but);
    iutManager.switchIutRecherches(butManager.butSelectionnes);
  }

  return (
    <div
      className={classNames('grid', 'items-center', {
        'aspect-square': !etat,
        'col-span-1': !etat,
        'col-span-2': etat,
        'md:col-span-3': etat,
        'lg:col-span-4': etat,
      })}
      tabIndex={tabIndex}
    >
      {etat
        ? (
          <div
            className="grid gap-y-2 border-2 text-xs  border-blue-900"
          >
            <button
              type="button"
              onClick={changement}
              className="align-middle text-base text-center bg-slate-50 text-blue-900 border-b-2 border-blue-900"
            >
              {but.prettyPrintFiliere}
            </button>
            <p>
              Description formation :
              {but.description ? ` ${but.description}` : ''}
            </p>
            <div>
              <p>
                Parcours disponible :
              </p>
              {but.parcours.map((parcours) => (
                <p key={parcours[0]}>
                  {' '}
                  { parcours[1]}
                  {parcours !== but.parcours[but.parcours.length - 1] ? ',' : null}
                </p>
              ))}
            </div>
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
        : (
          <button
            type="image" // Pose problème, à changer mais le type="button" empêche les background-image
            onClick={changement}
            className={classNames('h-full', 'text-xs', 'md:text-sm', 'lg:text-lg', 'align-middle', 'text-center', 'leading-loose', className, maClasse, 'bg-contain')}
          >
            <h2 className="text-white px-2 py-3 bg-blue-transparent w-full">{but.prettyPrintFiliere}</h2>
          </button>
        )}
    </div>
  );
}
CaseFormation.propTypes = ({
  but: MPropTypes.objectOrObservableObject.isRequired,
  className: PropTypes.node.isRequired,
  tabIndex: PropTypes.number.isRequired,
});
export default observer(CaseFormation);
