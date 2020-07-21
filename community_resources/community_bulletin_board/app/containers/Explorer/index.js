/**
 *
 * Explorer
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectCategoryFilter,
  makeSelectInSmallMode,
  makeSelectPopupData,
  makeSelectSelectedResource,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import ResourceMap from '../../components/ResourceMap';
import {
  makeSelectAllLocationsGeoJSON,
  makeSelectCommunity,
} from '../App/selectors';
import { localPropTypes } from '../../utils';
import { getCommunityDataRequest } from '../App/actions';
import { Wrapper, Content } from './Layout';
import { setResourceFilter, setSelectedResource } from './actions';

export function Explorer({
  community,
  allLocations,
  handleResourceSelection,
  handleClose,
  selectedResource,
  handleFilterChange,
  categoryFilter,
  handleRequestDetails,
}) {
  useInjectReducer({ key: 'explorer', reducer });
  useInjectSaga({ key: 'explorer', saga });

  return (
    <Wrapper>
      <Helmet>
        <title>Explorer</title>
        <meta name="description" content="Description of Explorer" />
      </Helmet>
      <Content>
        <ResourceMap
          geojson={allLocations}
          community={community}
          onResourceSelection={handleResourceSelection}
          filter={categoryFilter}
          onFilterChange={handleFilterChange}
          selectedResource={selectedResource}
          onCloseDetails={handleClose}
          onOpenDetails={handleRequestDetails}
        />
      </Content>
    </Wrapper>
  );
}

Explorer.propTypes = {
  community: localPropTypes.community,
  allLocations: localPropTypes.locations,
  handleResourceSelection: PropTypes.func,
  selectedResource: localPropTypes.resource,
  handleClose: PropTypes.func,
  handleFilterChange: PropTypes.func,
  handleRequestDetails: PropTypes.func,
  categoryFilter: PropTypes.object,
  popupData: PropTypes.shape({
    lngLat: PropTypes.arrayOf(PropTypes.number),
    mapRef: PropTypes.object,
  }),
};

const mapStateToProps = createStructuredSelector({
  community: makeSelectCommunity(),
  allLocations: makeSelectAllLocationsGeoJSON(),
  selectedResource: makeSelectSelectedResource(),
  categoryFilter: makeSelectCategoryFilter(),
  popupData: makeSelectPopupData(),
  inSmallMode: makeSelectInSmallMode(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleRequestCommunityData: communityId =>
      dispatch(getCommunityDataRequest(communityId)),
    handleResourceSelection: (resource, popupData, inSmallMode) =>
      dispatch(setSelectedResource(resource, popupData, inSmallMode)),
    handleClose: () => dispatch(setSelectedResource(undefined)),
    handleFilterChange: filter => dispatch(setResourceFilter(filter)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Explorer);
