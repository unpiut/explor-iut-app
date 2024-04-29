import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import logoPict from '../assets/logo-les-iut.svg';
import logoUnpiut from '../assets/logo-unpiut.webp';
import fleche from '../assets/icone-les-iut.svg';
import RootStore from '../RootStore';

function AppNavbar() {
  const { t } = useTranslation();
  const { selectedManager } = useContext(RootStore);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className="bg-slate-50 fixed z-50 top-0 left-0 right-0">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button type="button" onClick={() => setNavOpen(!navOpen)} className="group relative inline-flex items-center justify-center rounded-md p-2 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Ouvrir le menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path className="group-hover:text-white" strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path className="group-hover:text-white" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 gap-14 sm:gap-1 lg:gap-40 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <a href="https://www.iut.fr/">
                <img className="h-8 lg:h-12 w-auto" src={logoPict} alt="Logo des IUT" />
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:block sm:py-6">
              <div className="flex space-x-4 gap-10">
                <div className="flex">
                  <Link to="/formation" className="group flex gap-2 hover:bg-blue-900 rounded-md px-3 py-2 text-sm font-medium">
                    <p className="group-hover:text-white">{t('navigation1')}</p>
                    <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
                  </Link>
                  <Link to={selectedManager.nbButSelectionnes > 0 ? '/map' : '?'} className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-sm font-medium">
                    <p className={selectedManager.nbButSelectionnes < 1 ? 'text-blue-100' : 'group-hover:bg-blue-900 group-hover:text-white'}>{t('navigation2')}</p>
                    <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
                  </Link>
                  <Link to={selectedManager.nbButSelectionnes > 0 ? '/result' : '?'} className="group hover:bg-blue-900  flex gap-2 rounded-md px-3 py-2 text-sm font-medium">
                    <p className={selectedManager.nbButSelectionnes < 1 ? 'text-blue-100' : 'group-hover:bg-blue-900 group-hover:text-white'}>{t('navigation3')}</p>
                    <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
                  </Link>
                  <Link to={selectedManager.nbIutSelectionnesId > 0 ? '/mail' : '?'} className={`${selectedManager.nbIutSelectionnesId < 1 ? 'text-blue-100' : 'hover:bg-blue-900 hover:text-white'}  flex gap-2 rounded-md px-3 py-2 text-sm font-medium`}>
                    {t('navigation4')}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center">
              <a href="https://www.unpiut.fr/">
                <img className="w-auto h-10 lg:h-20" src={logoUnpiut} alt="Logo UNPIUT" />
              </a>
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
          <Link to="/" className=" group flex gap-2  hover:bg-blue-900 rounded-md px-3 py-2 text-lg font-medium">
            <p className="group-hover:text-white">{t('navigation1')}</p>
            <img width={25} src={fleche} alt="fleche" />
          </Link>
          <Link to="/map" className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-lg font-medium">
            <img width={25} src={fleche} alt="fleche" />
            <p className="group-hover:text-white">{t('navigation2')}</p>
          </Link>
          <Link to="/result" className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-lg font-medium">
            <p className="group-hover:text-white">{t('navigation3')}</p>
            <img width={25} src={fleche} alt="fleche" />
          </Link>
          <Link to={selectedManager.nbIutSelectionnesId > 0 ? '/mail' : '?'} className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-lg font-medium">
            <img width={25} src={fleche} alt="fleche" />
            <p className="group-hover:text-white">{t('navigation4')}</p>
          </Link>
          <div className="w-full h-0.5 bg-blue-900" />
          <Link to="/mentions" className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-lg font-medium">
            <p className="group-hover:text-white">{t('navigation5')}</p>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default observer(AppNavbar);
