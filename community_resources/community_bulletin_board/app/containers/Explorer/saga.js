import { takeLatest, call, put, select } from 'redux-saga/effects';
import { GET_COMMUNITY_DATA_SUCCESS } from '../App/constants';
import { setResourceFilter } from './actions';

const reduceCategoriesToFilterDefault = (filter, currentCategory) => ({
  ...filter,
  [currentCategory.slug]: true,
});

function* resetFilter(action) {
  try {
    const categories = action.payload.data.resourceCategories;
    const defaultFilter = categories.reduce(
      reduceCategoriesToFilterDefault,
      {},
    );
    yield put(setResourceFilter(defaultFilter));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    yield put(setResourceFilter(undefined));
  }
}

export default function* explorerSaga() {
  yield takeLatest(GET_COMMUNITY_DATA_SUCCESS, resetFilter);
}
