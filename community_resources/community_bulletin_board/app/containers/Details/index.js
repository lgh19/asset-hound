/**
 *
 * Details
 *
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectDetails from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { localPropTypes } from '../../utils';
import { makeSelectCommunity, makeSelectLocation } from '../App/selectors';
import ResourceDetails from '../../components/ResourceDetails';

function slugFromPathname(pathname) {
  return pathname
    .split('/')
    .reduce((lastValidStr, curStr) => curStr || lastValidStr, '');
}

export function Details({ location, community }) {
  useInjectReducer({ key: 'details', reducer });
  useInjectSaga({ key: 'details', saga });
  const [resource, setResource] = useState(undefined);

  useEffect(() => {
    if (location && community) {
      const slug = slugFromPathname(location.pathname);
      setResource(community.resources.filter(r => r.slug === slug)[0]);
    }
  }, [location, community]);

  return (
    <div>
      <Helmet>
        <title>{resource && resource.name}</title>
        <meta name="description" content="Description of Details" />
      </Helmet>
      {!!resource && <ResourceDetails resource={resource} />}
    </div>
  );
}

Details.propTypes = {
  location: PropTypes.object,
  community: localPropTypes.community,
};

const mapStateToProps = createStructuredSelector({
  location: makeSelectLocation(),
  community: makeSelectCommunity(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Details);
