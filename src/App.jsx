import React from 'react';
// import classNames from 'classnames';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import Root from './components/Root';
import FatalError from './components/FatalError';
import FormationView from './components/FormationView';
import MapView from './components/MapView';
import MailView from './components/MailView';
import ResultView from './components/ResultView';
import ModifyMailView from './components/ModifyMailView';
import MailSendView from './components/MailSendView';
import FirstPage from './components/FirstPage';
import RootStore from './RootStore';
import STORE from './store';

import { WithPagedTitle } from './components/utils';
import LegalNotice from './components/LegalNotice';
import AdminTools from './components/AdminTools';
import ValidateView from './components/ValidateView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <FatalError />,
    loader: async () => {
      await STORE.bootstraping;
      return true;
    },
    children: [
      {
        index: true,
        element: <WithPagedTitle pageTitle="Accueil"><FirstPage /></WithPagedTitle>,
      },
      {
        path: 'formation',
        element: <WithPagedTitle pageTitle="Formation"><FormationView /></WithPagedTitle>,
      },
      {
        path: 'map',
        element: <WithPagedTitle pageTitle="Carte"><MapView /></WithPagedTitle>,
        loader: async () => {
          if (!STORE.selectedManager.nbButSelectionnes) {
            throw redirect('/');
          }
          return null;
        },
      },
      {
        path: 'result',
        element: <WithPagedTitle pageTitle="Récapitulatif"><ResultView /></WithPagedTitle>,
        loader: async () => {
          if (!STORE.selectedManager.nbButSelectionnes) {
            throw redirect('/');
          }
          return null;
        },
      },
      {
        path: 'mail',
        element: <WithPagedTitle pageTitle="Formulaire de contact"><MailView /></WithPagedTitle>,
        loader: async () => {
          if (!STORE.selectedManager.nbIutSelectionnesId) {
            throw redirect('/');
          }
          return null;
        },
      },
      {
        path: 'modifyMail',
        element: <WithPagedTitle pageTitle="Édition du courriel"><ModifyMailView /></WithPagedTitle>,
        loader: async () => {
          if (!STORE.selectedManager.nbIutSelectionnesId) {
            throw redirect('/');
          }
          return null;
        },
      },
      {
        path: 'mailSend',
        element: <WithPagedTitle pageTitle="Courriel envoyé"><MailSendView /></WithPagedTitle>,
      },
      {
        path: 'validate',
        element: <WithPagedTitle pageTitle="Validation"><ValidateView /></WithPagedTitle>,
      },
      {
        path: 'mentions',
        element: <WithPagedTitle pageTitle="Mentions légales"><LegalNotice /></WithPagedTitle>,
      },
      {
        path: 'admin',
        element: <WithPagedTitle pageTitle="Administration"><AdminTools /></WithPagedTitle>,
      },
    ],
  },
], {
  basename: APP_ENV_APP_PUBLIC_PATH,
});

function App() {
  return (
    <RootStore.Provider value={STORE}>
      <RouterProvider router={router} />
    </RootStore.Provider>
  );
}

export default App;
