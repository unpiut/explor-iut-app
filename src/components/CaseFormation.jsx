/* eslint no-param-reassign: ["error", { "props": false }] */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import classNames from 'classnames';
import RootStore from '../RootStore';
import style from './CaseFormationjsx.css';

function CaseFormation({
  but, tabIndex, canOpen, isClose,
}) {
  const [close, setClose] = useState(true);
  const [overflowDesc, setoverflowDesc] = useState(false);
  const [overflowJob, setoverflowJob] = useState(false);
  const { iutManager, selectedManager } = useContext(RootStore);
  const maClasse = style[`bg-${but.code}`] ?? style['bg-DEFAULT']; // On charge la classe 'version js' de nom bg-codeBUT ou bg-DEFAULT si la classe précédente n'existe pas
  function changement() {
    but.getInfo();
    if (close) {
      canOpen();
      setClose(false);
    } else {
      canOpen();
      setClose(true);
    }
  }

  function selectionner() {
    selectedManager.switchButSelectionne(but);
    iutManager.switchIutRecherches(selectedManager.butSelectionnes);
  }

  return (
    <div
      className={classNames('grid', 'items-center', {
        'aspect-square': !isClose,
        'col-span-1': !isClose,
        'col-span-2': isClose,
        'md:col-span-3': isClose,
        'lg:col-span-4': isClose,
      })}
      tabIndex={tabIndex}
    >
      {isClose
        ? (
          <div
            className="grid gap-y-2 border-2 text-xs  border-blue-900"
          >
            <button
              type="button"
              onClick={changement}
              className={`align-middle font-bold text-base text-center ${selectedManager.butSelectionnes.has(but) ? 'bg-red-700' : 'bg-blue-900'} text-slate-50 border-blue-900`}
            >
              {selectedManager.butSelectionnes.has(but) ? `${but.prettyPrintFiliere} ✔️` : but.prettyPrintFiliere}
            </button>
            <p className="font-bold text-sm">
              Titre académique de la formation :
              {` ${but.nom} (${but.code})`}
            </p>
            <button type="button" className="text-left" onClick={() => setoverflowDesc(!overflowDesc)}>
              <p className="font-bold">
                Description formation :
              </p>
              <p className={classNames({
                'max-h-16': !overflowDesc,
                'overflow-hidden': !overflowDesc,
              })}
              >
                {but.description ? ` ${but.description}` : ''}
              </p>
              {!overflowDesc ? <p>...</p> : null}
            </button>
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
            <button type="button" className="text-left" onClick={() => setoverflowJob(!overflowJob)}>
              <p className="font-bold">
                Débouchés métiers :
              </p>
              <p className={classNames({
                'max-h-16': !overflowJob,
                'overflow-hidden': !overflowJob,
              })}
              >
                {but.metiers ? ` ${but.metiers}` : ''}
              </p>
              {!overflowJob ? <p>...</p> : null}
            </button>

            <div>
              <a className="underline" target="_blank" href={but.urlIUT} rel="noreferrer">en savoir plus</a>
            </div>
            <button className="m-2 text-base font-bold border-2 border-blue-900" onClick={selectionner} type="button">{!selectedManager.butSelectionnes.has(but) ? 'selectionner' : 'deselectionner'}</button>
          </div>
        )
        : (
          <button
            type="button" // Pose problème, à changer mais le type="button" empêche les background-image
            onClick={changement}
            className={`h-full max-w-full overflow-hidden break-words text-xs md:text-base align-middle text-center leading-loose border-2 border-blue-900 ${maClasse} bg-contain`}
          >
            <h2 className={`text-white px-2 font-bold py-3 ${selectedManager.butSelectionnes.has(but) ? 'bg-red-transparent' : 'bg-blue-transparent'} w-full`}>{but.prettyPrintFiliere}</h2>
          </button>
        )}
    </div>
  );
}
CaseFormation.propTypes = ({
  but: MPropTypes.objectOrObservableObject.isRequired,
  tabIndex: PropTypes.number.isRequired,
  canOpen: PropTypes.func.isRequired,
  isClose: PropTypes.bool.isRequired,
});
export default observer(CaseFormation);
