import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import RootStore from '../RootStore';

function ModaleDownload({ onClose }) {
  const { t } = useTranslation();
  const { selectedManager } = useContext(RootStore);
  const [selectedFormat, setSelectedFormat] = useState('xlsx');

  const formats = [
    {
      value: 'xlsx', label: 'Excel', icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      value: 'ods', label: 'ODS', icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      value: 'csv', label: 'CSV', icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
          <path fillRule="evenodd" d="M7 7h6v2H7V7zm0 4h6v2H7v-2z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  const handleDownload = () => {
    selectedManager.telecharger(selectedFormat);
    onClose();
  };

  const selectedFormatData = formats.find(f => f.value === selectedFormat);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-2xl border-2 border-blue-900 w-full max-w-md mx-4 animate-fadeIn">
        {/* Header */}
        <div className="bg-blue-900 rounded-t-lg p-4 flex justify-between items-center">
          <h2 className="text-slate-50 text-xl font-bold flex items-center gap-2">
            {t('recapModaleTel')}
          </h2>
          <button
            className="group relative text-slate-50 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none"
            type="button"
            onClick={onClose}
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:stroke-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6">
            Choisissez le format d'exportation
          </p>

          {/* Menu déroulant personnalisé */}
          <div className="relative mb-8">
            <div className="relative">
              <select
                value={selectedFormat}
                onChange={e => setSelectedFormat(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-blue-900 rounded-lg px-4 py-3 pr-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {formats.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bouton de téléchargement */}
          <button
            className="w-full flex items-center justify-center gap-2 cursor-pointer bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transform hover:scale-[1.02] transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            type="button"
            onClick={handleDownload}
          >
            Télécharger en
            {' '}
            {selectedFormatData.label}
          </button>
        </div>
      </div>
    </div>
  );
}

ModaleDownload.propTypes = ({
  onClose: PropTypes.func.isRequired,
});

export default observer(ModaleDownload);
