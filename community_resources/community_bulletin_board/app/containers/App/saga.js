import { takeLatest, all, call, put, delay } from 'redux-saga/effects';

import {
  getCommunityDataFailure,
  getCommunityDataSuccess,
  searchResourceFailure,
  searchResourceSuccess,
} from './actions';
import Api from '../../Api';
import {
  GET_COMMUNITY_DATA_REQUEST,
  SEARCH_RESOURCE_REQUEST,
} from './constants';

export function* handleGetCommunityData(action) {
  console.log('gettin')
  const { communityId } = action.payload;
  try {
    const response = yield call(Api.requestCommunityData, communityId);
    if (response.ok) {
      const data = yield response.json();
      yield put(getCommunityDataSuccess(data));
    } else {
      yield put(getCommunityDataFailure(response.text));
    }
  } catch (err) {
    yield put(getCommunityDataFailure(err));
  }
}

export function* handleSearchResource(action) {
  console.log('searchin')
  const { text } = action.payload;
  yield delay(250);
  try {
    const response = yield call(Api.searchResources, text);
    console.log(text, response);
    if (response.ok) {
      const data = yield response.json();
      yield put(searchResourceSuccess(data));
    } else {
      yield put(searchResourceFailure(response.text));
    }
  } catch (err) {
    yield put(searchResourceFailure(err));
  }
}

export default function* bulletinBoardSaga() {
  yield all([
    takeLatest(GET_COMMUNITY_DATA_REQUEST, handleGetCommunityData),
    takeLatest(SEARCH_RESOURCE_REQUEST, handleSearchResource),
  ]);
}
