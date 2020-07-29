/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Provider, defaultTheme, Flex, View } from '@adobe/react-spectrum';
import { useInjectReducer } from '../../utils/injectReducer';
import GlobalStyle from '../../global-styles';
import AppHeader from '../../components/AppHeader';
import { setDarkMode } from './actions';
import { makeSelectColorScheme } from './selectors';
import reducer from './reducer';
import Explorer from '../Explorer';
import Footer from '../../components/Footer';

function App({ colorScheme, handleDarkModeChange }) {
  useInjectReducer({ key: 'global', reducer });

  return (
    <Provider theme={defaultTheme} colorScheme={colorScheme} width="100%">
      <Flex direction="column" height="100%" maxHeight="100%'">
        <View height="size-1000">
          <AppHeader
            colorScheme={colorScheme}
            onDarkModeChange={handleDarkModeChange}
          />
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
  colorScheme: PropTypes.string,
  handleDarkModeChange: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  colorScheme: makeSelectColorScheme(),
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
