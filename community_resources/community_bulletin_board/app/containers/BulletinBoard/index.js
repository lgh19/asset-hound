/**
 *
 * BulletinBoard
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { push } from 'connected-react-router';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import { Container } from '@material-ui/core';
import _ from 'lodash';
import { filterResourcesByCategory, localPropTypes } from '../../utils';
import ResourceList from '../../components/ResourceList';
import NavMenu from '../../components/NavMenu';
import CategorySection from '../../components/CategorySection';
import {
  makeSelectAllLocationsGeoJSON,
  makeSelectCommunity,
} from '../App/selectors';
import messages from './messages';
import BackToTopButton from '../../components/BackToTopButton';
import Content from '../../components/Content';

const ScrollZone = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export function BulletinBoard({ community, gotoPage }) {
  const contentRef = useRef(null);
  const [backToTopButtonVisible, setbackToTopButtonVisible] = useState(false);

  // listen to scroll business
  useEffect(() => {
    if (contentRef && contentRef.current) {
      contentRef.current.addEventListener('scroll', handleScroll);
    }
  }, [contentRef.current]);

  function handleScroll() {
    if (contentRef && contentRef.current) {
      if (!backToTopButtonVisible && contentRef.current.scrollTop >= 500) {
        setbackToTopButtonVisible(true);
      }
      if (backToTopButtonVisible && contentRef.current.scrollTop < 500) {
        setbackToTopButtonVisible(false);
      }
    }
  }

  // handle no data
  if (!community)
    return (
      <div>
        <Typography variant="h3">Loading...</Typography>
      </div>
    );
  return (
    <ScrollZone
      ref={contentRef}
      onScroll={_.debounce(handleScroll, 100)}
      style={{ maxHeight: '100%', overflow: 'auto' }}
    >
      <Container maxWidth="md">
        <Helmet>
          <title>{community.name} Resources</title>
          <meta
            name="description"
            content={`Listing of available resources}.`}
          />
        </Helmet>

        <Typography variant="h2" component="span" id="call-to-action">
          <FormattedMessage {...messages.callToAction} />
        </Typography>

        <NavMenu sections={community.resourceCategories} gotoPage={gotoPage} />

        <div>
          <Content html={community.topSectionContent} />
        </div>

        {community.resourceCategories.map(category => (
          <CategorySection category={category}>
            <ResourceList
              category={category}
              resources={filterResourcesByCategory(
                community.resources,
                category,
              )}
            />
          </CategorySection>
        ))}
        <BackToTopButton
          hidden={!backToTopButtonVisible}
          scroller={contentRef.current}
        />
      </Container>
    </ScrollZone>
  );
}

BulletinBoard.propTypes = {
  community: localPropTypes.community,
  allLocations: localPropTypes.locations,
  handleRequestCommunityData: PropTypes.func,
  gotoPage: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  community: makeSelectCommunity(),
});

function mapDispatchToProps(dispatch) {
  return {
    gotoPage: pathname => dispatch(push(pathname)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(BulletinBoard);
