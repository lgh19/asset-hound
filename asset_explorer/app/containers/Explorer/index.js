/*
 * Explorer
 *
 *
 *
 */

import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  Flex,
  ListBox,
  Item,
  View,
  SearchField,
  Divider,
  Text,
} from '@adobe/react-spectrum';
import { Header } from '@react-spectrum/view';
import { Heading } from '@react-spectrum/text';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
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
import { makeSelectColorScheme } from '../App/selectors';
import { categorySchema } from '../../schemas';
import MapFilter from '../../components/MapFilter';
import AssetList from '../../components/AssetList';
// import AssetList from '../../components/AssetList';

function makeAssetFilter(newFilters) {
  return ['in', ['get', 'category'], ['literal', newFilters]];
}

const categoryFilter = filters => category => filters.includes(category.name);

function Explorer({
  allAssets,
  getCategories,
  getAsset,
  categories,
  colorScheme,
  assetListOffset,
  loadingAssets,
  moreAssetsRemain,
  getNextAssetPage,
  handleSearch,
  handleClearSearch,
  searchTerm,
  currentAsset,
}) {
  useInjectReducer({ key: 'explorer', reducer });
  useInjectSaga({ key: 'explorer', saga });
  const [filters, setFilters] = useState(
    categories ? categories.map(c => c.name) : undefined,
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
      const tempFilters = categories.map(c => c.name);
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
    <Flex direction="row" flex="1" minHeight="size-0">
      <Flex direction="column" minHeight="size-0" width="size-3600">
        <Header>
          <View width="100%" paddingX="size-150">
            <Heading level={2}>Explore community assets near you</Heading>
          </View>
        </Header>

        <View width="100%" padding="size-150">
          <Heading level={3} id="searchLabel">
            Search for Assets
          </Heading>
          <SearchField
            value={searchTerm}
            aria-labelledby="searchLabel"
            placeholder="Start typing to search for assets"
            onChange={handleSearch}
            width="100%"
          />
        </View>

        <View width="100%" padding="size-150">
          <Heading level={3} id="filterLabel">
            Filter By Category
          </Heading>
          <MapFilter
            categories={categories}
            filters={filters}
            onChange={handleFilterChange}
            aria-labelledby="filterLabel"
          />
        </View>
        <Divider size="M" />
        <Flex direction="column" flex="1" minHeight="size-0">
          <View padding="size-150">
            <Heading level={3} id="assetListLabel">
              Assets
            </Heading>
          </View>
          <View overflow="auto" flex="1" minHeight="size-0" padding="size-150">
            <AssetList
              aria-labelledby="assetListLabel"
              assets={allAssets}
              currentAsset={currentAsset}
              onSelectAsset={getAsset}
              isLoading={loadingAssets}
              // onLoadMore={getNextAssetPage(assetListOffset)}
            >
              {item => <Item key={item.name}>{item.name}</Item>}
            </AssetList>
          </View>
        </Flex>
      </Flex>
      <Divider size="M" orientation="vertical" />
      {/* Map */}
      <View flex>
        <Map
          colorScheme={colorScheme}
          onAssetClick={getAsset}
          categories={currCategories}
          filter={mbFilter}
          searchTerm={searchTerm}
        />
      </View>
      <Divider size="M" orientation="vertical" />
      {/* Details */}
      <View width="size-4600">
        <InfoPanel />
      </View>
    </Flex>
  );
}

Explorer.propTypes = {
  allAssets: PropTypes.arrayOf(PropTypes.object),
  getAsset: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  colorScheme: PropTypes.string,
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
  colorScheme: makeSelectColorScheme(),
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
