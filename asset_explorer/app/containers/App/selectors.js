import { createSelector } from 'reselect';
import { initialState as globalInitialState } from './reducer';

const selectRouter = state => state.router;
const selectGlobal = state => state.global || globalInitialState;

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.location,
  );

const makeSelectColorScheme = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.colorScheme,
  );

export { makeSelectLocation, makeSelectColorScheme };
