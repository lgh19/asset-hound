/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import NotFoundPage from 'containers/NotFoundPage/Loadable';

import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../../global-styles';
import Explorer from '../Explorer';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { useInjectSaga } from '../../utils/injectSaga';
import { localPropTypes } from '../../utils';
import Typography from '../../components/Typography';
import {
  makeSelectAllLocationsGeoJSON,
  makeSelectCommunity,
} from './selectors';
import { getCommunityDataRequest } from './actions';

import theme from '../../theme';

function App({ community, allLocations, handleRequestCommunityData }) {
  useInjectReducer({ key: 'global', reducer });
  useInjectSaga({ key: 'global', saga });

  // Init
  useEffect(() => {
    console.log('hello');
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
    <ThemeProvider theme={theme} style={{ height: '100%' }}>
      <div style={{ height: '100%', display: 'flex' }}>
        <Switch>
          <Route exact path="/" component={Explorer} />
          <Route component={NotFoundPage} />
        </Switch>
        <GlobalStyle />
      </div>
    </ThemeProvider>
  );
}

App.propTypes = {
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

export default compose(withConnect)(App);
