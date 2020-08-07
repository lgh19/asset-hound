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
import { push } from 'connected-react-router';

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
  makeSelectCommunity,
  makeSelectIsSearching,
  makeSelectLocation,
  makeSelectSearchResults,
} from './selectors';
import { getCommunityDataRequest, searchResourceRequest } from './actions';

import theme, { muiTheme } from '../../theme';

import { Wrapper, Content, TopBar } from './Layout';

import BulletinBoard from '../BulletinBoard';
import Header from '../../components/Header';

function App({
  community,
  location,
  handleRequestCommunityData,
  handleSearch,
  searchResults,
  isSearching,
  goToPage
}) {
  useInjectReducer({ key: 'global', reducer });
  useInjectSaga({ key: 'global', saga });

  // Init
  useEffect(() => {
    handleRequestCommunityData(1);
  }, []);
  console.debug(location);
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
              <Header
                title={title || 'Neighborhood Resources'}
                onSearch={location.pathname === '/' ? handleSearch : undefined}
                searchResults={searchResults}
                isSearching={isSearching}
                location={location}
                goToPage={goToPage}
              />
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
  location: PropTypes.object,
  community: localPropTypes.community,
  searchResults: PropTypes.array, // todo: create type
  handleRequestCommunityData: PropTypes.func,
  handleSearch: PropTypes.func,
  isSearching: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  location: makeSelectLocation(),
  community: makeSelectCommunity(),
  searchResults: makeSelectSearchResults(),
  isSearching: makeSelectIsSearching(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleRequestCommunityData: communityId =>
      dispatch(getCommunityDataRequest(communityId)),
    handleSearch: text => dispatch(searchResourceRequest(text)),
    goToPage: pathname => dispatch(push(pathname)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(App);
