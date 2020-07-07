/**
 *
 * Explorer
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectExplorer, { makeSelectSelectedResource } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import ResourceMap from '../../components/ResourceMap';
import {
  makeSelectAllLocationsGeoJSON,
  makeSelectCommunity,
} from '../App/selectors';
import { localPropTypes } from '../../utils';
import { getCommunityDataRequest } from '../App/actions';
import Typography from '../../components/Typography';
import Header from '../../components/Header';
import { Wrapper, Content, TopBar } from './Layout';
import ResourceDetails from '../../components/ResourceDetails';
import { setSelectedResource } from './actions';
import SearchBar from '../../components/SearchBar';

export function Explorer({
  community,
  allLocations,
  handleRequestCommunityData,
  handleResourceSelection,
  handleClose,
  selectedResource,
}) {
  useInjectReducer({ key: 'explorer', reducer });
  useInjectSaga({ key: 'explorer', saga });

  return (
    <Wrapper>
      <Helmet>
        <title>Explorer</title>
        <meta name="description" content="Description of Explorer" />
      </Helmet>
      <TopBar>
        <Header title="Hill District Resources" />
      </TopBar>
      <Content>
        <ResourceMap
          geojson={allLocations}
          community={community}
          handleResourceSelection={handleResourceSelection}
        />
        {selectedResource && (
          <ResourceDetails
            resource={selectedResource}
            handleClose={handleClose}
          />
        )}
      </Content>
    </Wrapper>
  );
}

Explorer.propTypes = {
  community: localPropTypes.community,
  allLocations: localPropTypes.locations,
  handleRequestCommunityData: PropTypes.func,
  handleResourceSelection: PropTypes.func,
  selectedResource: localPropTypes.resource,
  handleClose: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  community: makeSelectCommunity(),
  allLocations: makeSelectAllLocationsGeoJSON(),
  selectedResource: makeSelectSelectedResource(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleRequestCommunityData: communityId =>
      dispatch(getCommunityDataRequest(communityId)),
    handleResourceSelection: resource =>
      dispatch(setSelectedResource(resource)),
    handleClose: () => dispatch(setSelectedResource(undefined)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Explorer);
