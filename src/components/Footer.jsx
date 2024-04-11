import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import fleche from '../assets/icone-les-iut.svg';
import motif from '../assets/motif_unpiut.png';

function Footer({
  droite, gauche,
}) {
  return (
    <div className="items-center justify-items-end justify-between fixed flex bottom-0 right-0 left-0 bg-slate-50 mt-5">
      {gauche && droite
        ? (
          <>
            <div className="flex justify-self-start h-3/5 m-4 ">
              <img width={30} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
              <Link className="text-sm sm:text-base" to={gauche.lien}>{gauche.texte}</Link>
            </div>
            <div className="lg:grid hidden">
              <img className="w-3/4 m-[auto]" src={motif} alt="motif unpiut" />
              <Link className="text-center underline" to="/mentions">Mentions légales</Link>
            </div>
            <div className={`ring rounded ${!droite.disable ? 'ring-blue-900' : 'ring-gray-400'}  m-4 items-center flex justify-self-end h-3/5`}>
              <Link className={`${!droite.disable ? '' : 'text-gray-400'} sm:text-base text-sm sm:font-bold`} to={!droite.disable ? droite.lien : droite.lienActu}>{droite.texte}</Link>
              <img width={30} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
            </div>
          </>
        ) : null}
      {!gauche && droite
        ? (
          <>
            <div />
            <div className="lg:grid hidden">
              <img className="w-3/4 m-[auto]" src={motif} alt="motif unpiut" />
              <Link className="text-center underline" to="/mentions">Mentions légales</Link>
            </div>
            <div className={`ring rounded ${!droite.disable ? 'ring-blue-900' : 'ring-gray-400'}  m-4 items-center flex justify-self-end h-3/5`}>
              <Link className={`${!droite.disable ? '' : 'text-gray-400'} sm:text-base text-sm sm:font-bold`} to={!droite.disable ? droite.lien : droite.lienActu}>{droite.texte}</Link>
              <img width={30} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
            </div>
          </>
        ) : null}
      {gauche && !droite
        ? (
          <>
            <div className="flex justify-self-start h-3/5 m-4 ">
              <img width={30} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
              <Link className="text-sm sm:text-base" to={gauche.lien}>{gauche.texte}</Link>
            </div>
            <div className="lg:grid hidden">
              <img className="w-3/4 m-[auto]" src={motif} alt="motif unpiut" />
              <Link className="text-center underline" to="/mentions">Mentions légales</Link>
            </div>
            <div />
          </>
        ) : null}
    </div>
  );
}
Footer.propTypes = {
  droite: PropTypes.shape({
    texte: PropTypes.string.isRequired,
    lien: PropTypes.string,
    disable: PropTypes.bool,
    lienActu: PropTypes.string,
  }),
  gauche: PropTypes.shape({
    texte: PropTypes.string.isRequired,
    lien: PropTypes.string,
  }),
};

Footer.defaultProps = {
  droite: null,
  gauche: null,
};
export default Footer;
