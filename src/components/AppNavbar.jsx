import React from 'react';
import { Link } from 'react-router-dom';
import logoPict from '../assets/logo-les-iut.svg';
import fleche from '../assets/icone-les-iut.svg';

function AppNavbar() {
  function etendre() {
    const nav = document.getElementById('mobile-menu');
    if (nav.classList.contains('hidden')) {
      nav.classList.remove('hidden');
    } else {
      nav.classList.add('hidden');
    }
  }
  return (
    <nav className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button type="button" onClick={etendre} className="group relative inline-flex items-center justify-center rounded-md p-2 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
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
              <img className="h-8 w-auto" src={logoPict} alt="Your Company" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link to="https://www.iut.fr/" className=" hover:bg-blue-900 hover:text-white rounded-md px-3 py-2 text-sm font-medium">SITE LES IUT</Link>
                <Link to="https://www.unpiut.fr/" className=" hover:bg-blue-900 hover:text-white block rounded-md px-3 py-2 text-sm font-medium">SITE UNPIUT</Link>
                <div className="border border-blue-900" />
                <Link to="/" className="group flex gap-2 hover:bg-blue-900 rounded-md px-3 py-2 text-sm font-medium">
                  <p className="group-hover:text-white">1. Choix des formations</p>
                  <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
                </Link>
                <Link to="/map" className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-sm font-medium">
                  <p className="group-hover:text-white">2. Carte interactive</p>
                  <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
                </Link>
                <Link to="/result" className="group hover:bg-blue-900  flex gap-2 rounded-md px-3 py-2 text-sm font-medium">
                  <p className="group-hover:text-white">3. Récapitulatif des choix</p>
                  <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
                </Link>
                <Link to="/mail" className=" hover:bg-blue-900 hover:text-white flex gap-2 rounded-md px-3 py-2 text-sm font-medium">
                  4. Courriel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bg-white w-full hidden sm:hidden  z-50" id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <Link to="https://www.iut.fr/" className=" hover:bg-blue-900 hover:text-white rounded-md px-3 py-2 text-lg font-medium">SITE LES IUT</Link>
          <Link to="https://www.unpiut.fr/" className=" hover:bg-blue-900 hover:text-white block rounded-md px-3 py-2 text-lg font-medium">SITE UNPIUT</Link>
          <div className="border border-blue-900" />
          <Link to="/" className=" group flex gap-2  hover:bg-blue-900 rounded-md px-3 py-2 text-lg font-medium">
            <p className="group-hover:text-white">1. Choix des formations</p>
            <img width={25} src={fleche} alt="fleche" />
          </Link>
          <Link to="/map" className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-lg font-medium">
            <img width={25} src={fleche} alt="fleche" />
            <p className="group-hover:text-white">2. Carte interactive</p>
          </Link>
          <Link to="/result" className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-lg font-medium">
            <p className="group-hover:text-white">3. Récapitulatif des choix</p>
            <img width={25} src={fleche} alt="fleche" />
          </Link>
          <Link to="/mail" className="group hover:bg-blue-900 flex gap-2 rounded-md px-3 py-2 text-lg font-medium">
            <img width={25} src={fleche} alt="fleche" />
            <p className="group-hover:text-white">4. Courriel</p>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
