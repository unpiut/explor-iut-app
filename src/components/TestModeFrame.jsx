import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import style from './TestModeFrame.css';

function TestModeFrame({ children }) {
  if (!APP_ENV_TEST_APP) {
    return children;
  }

  const horizontalClasses = classNames('grow w-full h-10 p-2 align-middle bg-red-600 text-white text-center font-extrabold tracking-wider');
  const verticalClasses = classNames('w-10 align-middle bg-red-600 text-white text-center font-extrabold tracking-wider', style.vertialTestText);
  const testText = 'APPLICATION EN MODE TEST';

  return (
    <>
      <div className="flex flex-row">
        <div className={horizontalClasses}>{testText}</div>
      </div>
      <div className="flex flex-row">
        <div className={verticalClasses}>{testText}</div>
        <div className="grow">{children}</div>
        <div className={verticalClasses}>{testText}</div>
      </div>
    </>
  );
}

TestModeFrame.propTypes = {
  children: PropTypes.element.isRequired,
};

export default TestModeFrame;
