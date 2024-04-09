import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import logoPict from '../assets/logo-les-iut.svg';
import logoUnpiut from '../assets/logo-unpiut.png';
import fleche from '../assets/icone-les-iut.svg';
import RootStore from '../RootStore';

function AppNavbar() {
  const { selectedManager } = useContext(RootStore);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className="bg-slate-50 fixed z-50 top-0 left-0 right-0">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button type="button" onClick={() => setNavOpen(!navOpen)} className="group relative inline-flex items-center justify-center rounded-md p-2 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path className="group-hover:text-white" strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path className="group-hover:text-white" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img className="h-8 w-auto" src={logoPict} alt="Logo des IUT" />
            </div>
            <div className="hidden sm:ml-6 sm:block sm:py-6">
              <div className="flex space-x-4">
                <Link to="https://www.iut.fr/" className=" hover:bg-blue-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium">SITE LES IUT</Link>
                <div className="border border-blue-900" />
                <Link to="/formation" className="group flex gap-2 hover:bg-blue-900 rounded-md px-3 py-2 text-sm font-medium">
                  <p className="group-hover:text-white">1. Choix des formations</p>
                  <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
                </Link>
                <Link to={selectedManager.nbButSelectionnes > 0 ? '/map' : '?'} className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-sm font-medium">
                  <p className={selectedManager.nbButSelectionnes < 1 ? 'text-blue-100' : 'group-hover:bg-blue-900 group-hover:text-white'}>2. Choix de la localisation</p>
                  <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
                </Link>
                <Link to={selectedManager.nbButSelectionnes > 0 ? '/result' : '?'} className="group hover:bg-blue-900  flex gap-2 rounded-md px-3 py-2 text-sm font-medium">
                  <p className={selectedManager.nbButSelectionnes < 1 ? 'text-blue-100' : 'group-hover:bg-blue-900 group-hover:text-white'}>2. Récapitulatif de vos choix</p>
                  <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
                </Link>
                <Link to={selectedManager.nbIutSelectionnesId > 0 ? '/mail' : '?'} className={`${selectedManager.nbIutSelectionnesId < 1 ? 'text-blue-100' : 'hover:bg-blue-900 hover:text-white'}  flex gap-2 rounded-md px-3 py-2 text-sm font-medium`}>
                  3. Courriel
                </Link>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center">
              <img className="w-auto h-14" src={logoUnpiut} alt="Logo UNPIUT" />
            </div>
          </div>
        </div>
      </div>

      <div
        className={classNames('absolute', 'bg-white', 'w-full', 'sm:hidden', 'z-50', {
          hidden: !navOpen,
        })}
      >
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link to="https://www.iut.fr/" className=" hover:bg-blue-900 hover:text-white rounded-md px-3 py-2 text-lg font-medium">SITE LES IUT</Link>
          <div className="border border-blue-900" />
          <Link to="/" className=" group flex gap-2  hover:bg-blue-900 rounded-md px-3 py-2 text-lg font-medium">
            <p className="group-hover:text-white">1. Choix des formations</p>
            <img width={25} src={fleche} alt="fleche" />
          </Link>
          <Link to="/map" className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-lg font-medium">
            <img width={25} src={fleche} alt="fleche" />
            <p className="group-hover:text-white">2. Choix de la localisation</p>
          </Link>
          <Link to="/result" className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-lg font-medium">
            <p className="group-hover:text-white">2. Récapitulatif de vos choix</p>
            <img width={25} src={fleche} alt="fleche" />
          </Link>
          <Link to={selectedManager.nbIutSelectionnesId > 0 ? '/mail' : '?'} className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-lg font-medium">
            <img width={25} src={fleche} alt="fleche" />
            <p className="group-hover:text-white">3. Courriel</p>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default observer(AppNavbar);
