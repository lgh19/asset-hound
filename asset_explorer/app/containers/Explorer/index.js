/*
 * Explorer
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import Wrapper from './Wrapper';
import MainPane from './MainPane';
import SidePane from './SidePane';
import InfoPanel from '../InfoPanel';
import {
  makeSelectAllAssets,
  makeSelectAssetCategories,
  makeSelectExplorerCurrentAsset,
  makeSelectAssetListOffset,
  makeSelectLoadingAssets,
  makeSelectMoreAssetsRemain,
  makeSelectSearchTerm,
} from './selectors';
import {
  clearSearchTerm,
  getAssetDetailsRequest,
  getCategoriesRequest,
  getNextAssetPageRequest,
  setSearchTerm,
} from './actions';
import Map from '../../components/Map';
import { makeSelectDarkMode } from '../App/selectors';
import { categorySchema } from '../../schemas';
import AssetList from '../../components/AssetList';
import SideSheet from '../../components/SideSheet';
import SearchBox from '../../components/SearchBox';
import MapFilter from '../../components/MapFilter';

function reduceDefaultCategories(acc, cur) {
  return { ...acc, [cur.name]: true };
}

function makeAssetFilter(newFilters) {
  const filterCats = Object.entries(newFilters)
    .filter(([filter, value]) => value)
    .map(([filter, value]) => filter);
  return ['in', ['get', 'category'], ['literal', filterCats]];
}

const categoryFilter = filters => category => filters[category.name];

function Explorer({
  allAssets,
  getCategories,
  getAsset,
  categories,
  darkMode,
  assetListOffset,
  loadingAssets,
  moreAssetsRemain,
  getNextAssetPage,
  handleSearch,
  handleClearSearch,
  searchTerm,
}) {
  useInjectReducer({ key: 'explorer', reducer });
  useInjectSaga({ key: 'explorer', saga });
  const [filters, setFilters] = useState(
    categories ? categories.reduce(reduceDefaultCategories, {}) : undefined,
  );
  const [mbFilter, setMbFilter] = useState(['has', 'name']);
  const [currCategories, setCurrCategories] = useState(
    categories && filters
      ? categories.filter(categoryFilter(filters))
      : undefined,
  );
  /**
   * Initialization happens here
   */
  useEffect(() => {
    // load first page of assets for infinite list
    getNextAssetPage(0)();
    // load categories for use in map
    getCategories();
  }, []);

  /**
   * Reset list on search change
   */
  useEffect(() => {
    getNextAssetPage(0)();
  }, [searchTerm]);

  useEffect(() => {
    if (categories) {
      const tempFilters = categories.reduce(reduceDefaultCategories, {});
      setFilters(tempFilters);
      setMbFilter(makeAssetFilter(tempFilters));
      setCurrCategories(categories.filter(categoryFilter(tempFilters)));
    }
  }, [categories]);

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
    setCurrCategories(categories.filter(categoryFilter(newFilters)));
    setMbFilter(makeAssetFilter(newFilters));
  }

  return (
    <Wrapper>
      <SidePane>
        <SideSheet variant="nav">
          <SearchBox
            onChange={handleSearch}
            onClear={handleClearSearch}
            term={searchTerm}
          />
          <MapFilter
            categories={categories}
            filters={filters}
            onChange={handleFilterChange}
          />
          <AssetList
            hasNextPage={moreAssetsRemain}
            isNextPageLoading={loadingAssets}
            items={allAssets}
            loadNextPage={getNextAssetPage(assetListOffset)}
            onAssetClick={getAsset}
            searchTerm={searchTerm}
          />
        </SideSheet>
      </SidePane>
      <MainPane>
        <Map
          darkMode={darkMode}
          onAssetClick={getAsset}
          categories={currCategories}
          filter={mbFilter}
          searchTerm={searchTerm}
        />
      </MainPane>
      <SidePane>
        <InfoPanel />
      </SidePane>
    </Wrapper>
  );
}

Explorer.propTypes = {
  allAssets: PropTypes.arrayOf(PropTypes.object),
  getAsset: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  darkMode: PropTypes.bool,
  categories: PropTypes.arrayOf(PropTypes.shape(categorySchema)),

  assetListOffset: PropTypes.number,
  loadingAssets: PropTypes.bool,
  moreAssetsRemain: PropTypes.bool,
  getNextAssetPage: PropTypes.func,
  handleSearch: PropTypes.func,
  handleClearSearch: PropTypes.func,
  searchTerm: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  allAssets: makeSelectAllAssets(),
  currentAsset: makeSelectExplorerCurrentAsset(),
  categories: makeSelectAssetCategories(),
  darkMode: makeSelectDarkMode(),
  searchTerm: makeSelectSearchTerm(),

  assetListOffset: makeSelectAssetListOffset(),
  loadingAssets: makeSelectLoadingAssets(),
  moreAssetsRemain: makeSelectMoreAssetsRemain(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAsset: assetId => dispatch(getAssetDetailsRequest(assetId)),
    getCategories: () => dispatch(getCategoriesRequest()),
    getNextAssetPage: nextOffset => () =>
      dispatch(getNextAssetPageRequest(nextOffset)),
    handleSearch: term => dispatch(setSearchTerm(term)),
    handleClearSearch: () => dispatch(clearSearchTerm()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Explorer);
