/**
 *
 * BulletinBoard
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Layer, Source } from 'react-map-gl';

import reducer from '../App/reducer';
import saga from '../App/saga';
// import messages from './messages';
import { filterResourcesByCategory, localPropTypes } from '../../utils';
// import Header from '../../components/Header';
import Typography from '../../components/Typography';
import { getCommunityDataRequest } from '../App/actions';
import Board from './Board';
import Content from '../../components/Content';
import ResourceList from '../../components/ResourceList';
import NavMenu from '../../components/NavMenu';
import CategorySection from '../../components/CategorySection';
import Map from '../../components/Map';
import { allLocationsLayer } from './layers';
import ResourceMap from '../../components/ResourceMap';

export function BulletinBoard({
  community,
  allLocations,
  handleRequestCommunityData,
}) {
  useInjectReducer({ key: 'bulletinBoard', reducer });
  useInjectSaga({ key: 'bulletinBoard', saga });

  // Init
  useEffect(() => {
    handleRequestCommunityData(1);
  }, []);

  // handle no data
  if (!community)
    return (
      <div>
        <Typography variant="h3">Loading...</Typography>
      </div>
    );

  return (
    <Board>
      <Helmet>
        <title>{community.name} Resources</title>
        <meta name="description" content={`Listing of available resources}.`} />
      </Helmet>
      <Typography.H1>{community.name} Resources</Typography.H1>
      <Content html={community.topSectionContent} />
      <NavMenu sections={community.resourceCategories} />
      <Typography.H2>Or by location</Typography.H2>

      {community.resourceCategories.map(category => (
        <CategorySection category={category}>
          <ResourceList
            category={category}
            resources={filterResourcesByCategory(community.resources, category)}
          />
        </CategorySection>
      ))}
    </Board>
  );
}

BulletinBoard.propTypes = {
  community: localPropTypes.community,
  allLocations: localPropTypes.locations,
  handleRequestCommunityData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  community: makeSelectCommunity(),
  allLocations: makeSelectAllLocationsGeoJSON(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleRequestCommunityData: communityId =>
      dispatch(getCommunityDataRequest(communityId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(BulletinBoard);
