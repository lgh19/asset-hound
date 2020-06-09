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
import { makeSelectBulletinBoardCommunity } from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import { localPropTypes } from '../../utils';
// import Header from '../../components/Header';
import Typography from '../../components/Typography';
import { getCommunityDataRequest } from './actions';
import Board from './Board';
import Content from '../../components/Content';
import ResourceList from '../../components/ResourceList';
import NavMenu from '../../components/NavMenu';

export function BulletinBoard({ community, handleRequestCommunityData }) {
  useInjectReducer({ key: 'bulletinBoard', reducer });
  useInjectSaga({ key: 'bulletinBoard', saga });

  // Init
  useEffect(() => {
    handleRequestCommunityData(1);
  }, []);

  if (!community)
    return (
      <div>
        <Typography variant="h3">Loading...</Typography>
      </div>
    );

  return (
    <Board>
      <Helmet>
        <title>Resources</title>
        <meta name="description" content={`Listing of available resources}.`} />
      </Helmet>
      <Typography.H1>{community.name} Resources</Typography.H1>
      <Content html={community.topSectionContent} />
      <NavMenu sections={community.resourceCategories} />
      <ResourceList resources={community.resources} />
    </Board>
  );
}

BulletinBoard.propTypes = {
  community: localPropTypes.community,
  handleRequestCommunityData: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  community: makeSelectBulletinBoardCommunity(),
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
