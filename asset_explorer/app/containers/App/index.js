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
import PropTypes from 'prop-types';

// import HomePage from 'containers/Explorer/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Provider, defaultTheme, Flex, View } from '@adobe/react-spectrum';
import GlobalStyle from '../../global-styles';
import Header from '../../components/Header';
import AppWrapper from './AppWrapper';
import ContentWrapper from './ContentWrapper';
import { setDarkMode } from './actions';
import { makeSelectDarkMode } from './selectors';
import { useInjectReducer } from '../../utils/injectReducer';

import Explorer from '../Explorer';

import reducer from './reducer';
import Footer from '../../components/Footer';
import ContactCard from '../../components/ContactCard';

function App({ darkMode, handleDarkModeChange }) {
  useInjectReducer({ key: 'global', reducer });
  return (
    <Provider theme={defaultTheme} width="100%">
      <Flex
        direction="column"
        height="100%"
        maxHeight="100%'"
      >
        <View height="size-1000">
          <Header darkMode={darkMode} onDarkModeChange={handleDarkModeChange} />
        </View>

        <Flex
          direction="column"
          flex="1"
          minHeight="size-0"
          borderWidth="thickest"
          borderColor="blue-400"
        >
          <Switch>
            <Route exact path="/" component={Explorer} />
            <Route component={NotFoundPage} />
          </Switch>
        </Flex>
        <View flexShrink={1}>
          <Footer />
        </View>
      </Flex>
      <GlobalStyle />
    </Provider>
  );
}

App.propTypes = {
  darkMode: PropTypes.bool,
  handleDarkModeChange: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  darkMode: makeSelectDarkMode(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleDarkModeChange: darkModeOn => dispatch(setDarkMode(darkModeOn)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(App);
