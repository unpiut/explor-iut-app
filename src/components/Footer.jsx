import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import fleche from '../assets/icone-les-iut.svg';
import motif from '../assets/motif_unpiut.webp';

function Footer({
  droite, gauche, onClick,
}) {
  return (
    <div className="items-center justify-items-end justify-between fixed flex bottom-0 right-0 left-0 bg-slate-50 mt-5">
      {onClick
        ? (
          <>
            <div className="flex justify-self-start h-3/5 m-4 ">
              <img className="lg:block hidden" width={30} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
              <Link className="px-2 text-sm sm:text-base no-underline" to={gauche.lien}>{gauche.texte}</Link>
            </div>
            <div className="lg:grid hidden">
              <img className="w-3/4 m-[auto]" src={motif} alt="motif unpiut" />
              <Link className="text-center" to="/mentions">Mentions légales</Link>
            </div>
            <div className={`ring rounded ${!droite.disable ? 'ring-blue-900' : 'ring-gray-400'}  m-4 items-center flex justify-self-end h-3/5`}>
              <button type="button" onClick={onClick} className="sm:text-base px-2 text-sm sm:font-bold">{droite.texte}</button>
              <img className="lg:block hidden" width={30} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
            </div>
          </>
        )
        : null}
      {gauche && droite && !onClick
        ? (
          <>
            <div className="flex justify-self-start h-3/5 m-4 ">
              <img className="lg:block hidden" width={30} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
              <Link className="px-2 text-sm sm:text-base no-underline" to={gauche.lien}>{gauche.texte}</Link>
            </div>
            <div className="lg:grid hidden">
              <img className="w-3/4 m-[auto]" src={motif} alt="motif unpiut" />
              <Link className="text-center" to="/mentions">Mentions légales</Link>
            </div>
            <div className={`ring rounded ${!droite.disable ? 'ring-blue-900' : 'ring-gray-400'}  m-4 items-center flex justify-self-end h-3/5`}>
              <Link onClick={onClick} className={`${!droite.disable ? '' : 'text-gray-400'} sm:text-base px-2 text-sm sm:font-bold no-underline`} to={!droite.disable ? droite.lien : droite.lienActu}>{droite.texte}</Link>
              <img className="lg:block hidden" width={30} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
            </div>
          </>
        ) : null}
      {!gauche && droite && !onClick
        ? (
          <>
            <div />
            <div className="lg:grid hidden">
              <img className="w-3/4 m-[auto]" src={motif} alt="motif unpiut" />
              <Link className="text-center" to="/mentions">Mentions légales</Link>
            </div>
            <div className={`ring rounded ${!droite.disable ? 'ring-blue-900' : 'ring-gray-400'}  m-4 items-center flex justify-self-end h-3/5`}>
              <Link onClick={onClick} className={`${!droite.disable ? '' : 'text-gray-400'} sm:text-base px-2 text-sm sm:font-bold no-underline`} to={!droite.disable ? droite.lien : droite.lienActu}>{droite.texte}</Link>
              <img className="lg:block hidden" width={30} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
            </div>
          </>
        ) : null}
      {gauche && !droite && !onClick
        ? (
          <>
            <div className="flex justify-self-start h-3/5 m-4 ">
              <img className="lg:block hidden" width={30} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
              <Link className="px-2 text-sm sm:text-base no-underline" to={gauche.lien}>{gauche.texte}</Link>
            </div>
            <div className="lg:grid hidden">
              <img className="w-3/4 m-[auto]" src={motif} alt="motif unpiut" />
              <Link className="text-center" to="/mentions">Mentions légales</Link>
            </div>
            <div />
          </>
        ) : null}
    </div>
  );
}
Footer.propTypes = {
  onClick: PropTypes.func,
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
  onClick: null,
  droite: null,
  gauche: null,
};
export default Footer;
