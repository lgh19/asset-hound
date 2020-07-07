import { takeLatest, all, call, put } from 'redux-saga/effects';
import { getCommunityDataFailure, getCommunityDataSuccess } from './actions';
import Api from '../../Api';
import { GET_COMMUNITY_DATA_REQUEST } from './constants';

export function* handleGetCommunityData(action) {
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

export default function* bulletinBoardSaga() {
  yield all([takeLatest(GET_COMMUNITY_DATA_REQUEST, handleGetCommunityData)]);
}
