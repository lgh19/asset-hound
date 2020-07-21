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
import { MuiThemeProvider, StylesProvider } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import GlobalStyle from '../../global-styles';
import Explorer from '../Explorer';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { useInjectSaga } from '../../utils/injectSaga';
import { localPropTypes } from '../../utils';
import {
  makeSelectAllLocationsGeoJSON,
  makeSelectCommunity,
} from './selectors';
import { getCommunityDataRequest } from './actions';

import theme, { muiTheme } from '../../theme';

import { Wrapper, Content, TopBar } from './Layout';

import BulletinBoard from '../BulletinBoard';
import Header from '../../components/Header';
import Details from '../Details';

function App({ community, handleRequestCommunityData }) {
  useInjectReducer({ key: 'global', reducer });
  useInjectSaga({ key: 'global', saga });

  // Init
  useEffect(() => {
    handleRequestCommunityData(1);
  }, []);

  const title =
    community && community.name ? `${community.name} Resources` : undefined;

  // handle no data
  if (!community)
    return (
      <div>
        <Typography variant="h3">Loading...</Typography>
      </div>
    );

  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={muiTheme}>
        <ThemeProvider theme={theme} style={{ height: '100%' }}>
          <Wrapper>
            <TopBar>
              <Header title={title || 'Neighborhood Resources'} />
            </TopBar>
            <Content id="content">
              <Switch>
                <Route exact path="/" component={BulletinBoard} />
                <Route exact path="/map" component={Explorer} />
                <Route component={NotFoundPage} />
              </Switch>
            </Content>
            <GlobalStyle />
          </Wrapper>
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
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
