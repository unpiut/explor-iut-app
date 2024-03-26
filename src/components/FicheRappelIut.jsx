import React, { useState } from 'react';
import { PropTypes } from 'mobx-react';
import classNames from 'classnames';
import fleche from '../assets/icone-les-iut.svg';

function FicheRappelIut({ but, index }) {
  const [overflowDesc, setoverflowDesc] = useState(false);
  const [overflowJob, setoverflowJob] = useState(false);
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
      </div>
    </div>
  );
}
FicheRappelIut.propTypes = {
  but: PropTypes.objectOrObservableObject.isRequired,
};
export default FicheRappelIut;
