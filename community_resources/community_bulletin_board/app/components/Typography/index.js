/**
 *
 * Typography
 *
 * simple typography system based off of material-ui's
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import './styles.css';

const Variants = {
  BODY: 'body',
  NOTE: 'note',
  WARNING: 'warning',
  TITLE: 'title',
  SUBTITLE: 'subtitle',
  CAPTION: 'caption',
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
};

const componentMapping = {
  body: 'p',
  note: 'p',
  warning: 'p',
  title: 'p',
  subtitle: 'p',
  caption: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
};

function Typography({ variant, component, children, ...otherProps }) {
  const Elem = component || componentMapping[variant];
  return (
    <Elem className={`typography-${variant}`} {...otherProps}>
      {children}
    </Elem>
  );
}

Typography.propTypes = {
  variant: PropTypes.oneOf(Object.values(Variants)),
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  children: PropTypes.node,
};

Typography.defaultProps = {
  variant: 'body',
};

// make shortcut components from `componentMapping`
// eslint-disable-next-line array-callback-return
Object.keys(componentMapping).map(k => {
  Typography[`${k[0].toUpperCase()}${k.slice(1)}`] = memo(props => (
    <Typography {...props} variant={k} />
  ));
});

export default Typography;
