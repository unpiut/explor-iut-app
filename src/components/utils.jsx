/* eslint react/jsx-props-no-spreading: off */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export function withPageTitle(WrappedComponent, pageTitle, overrideAppTitle = false) {
  return function PagedComponent(props) {
    useEffect(() => {
      document.title = overrideAppTitle ? pageTitle : `${APP_ENV_APP_TITLE} - ${pageTitle}`;
    }, [pageTitle, overrideAppTitle]);
    return (<WrappedComponent {...props} />);
  };
}

export function WithPagedTitle({ pageTitle, overrideAppTitle, children }) {
  useEffect(() => {
    document.title = overrideAppTitle ? pageTitle : `${APP_ENV_APP_TITLE} - ${pageTitle}`;
  }, [pageTitle, overrideAppTitle]);
  return children;
}

WithPagedTitle.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  overrideAppTitle: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

WithPagedTitle.defaultProps = {
  overrideAppTitle: false,
};
