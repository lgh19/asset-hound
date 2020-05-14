/**
 *
 * AssetList
 *
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeList } from 'react-window';
// import { FormattedMessage } from 'react-intl';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ListItemText } from '@material-ui/core';

// import messages from './messages';

function AssetList({
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage,
  onAssetClick,
}) {

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  const loadMoreItems = isNextPageLoading
    ? () => {}
    : () => Promise.resolve(loadNextPage());

  const isItemLoaded = index => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const AssetListItem = ({ index, style }) => {
    const asset = items[index];
    let primary;
    let secondary;
    if (!isItemLoaded(index) || !asset) {
      primary = 'Loading...';
      secondary = '';
    } else {
      primary = asset.name;
      // eslint-disable-next-line prefer-destructuring
      secondary = asset.assetTypes[0].title;
    }

    return (
      <ListItem
        style={style}
        button
        divider
        onClick={() => onAssetClick(asset.id)}
      >
        <ListItemText
          primaryTypographyProps={{ noWrap: true, display: 'block' }}
          primary={primary}
          secondary={secondary}
        />
      </ListItem>
    );
  };

  return (
    <AutoSizer disableWidth>
      {({ height, width }) => (
        <List>
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                itemCount={itemCount}
                onItemsRendered={onItemsRendered}
                ref={ref}
                height={height}
                width={width}
                itemSize={75}
              >
                {AssetListItem}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        </List>
      )}
    </AutoSizer>
  );
}

AssetList.propTypes = {
  hasNextPage: PropTypes.bool,
  isNextPageLoading: PropTypes.bool,
  items: PropTypes.array,
  loadNextPage: PropTypes.func,
  onAssetClick: PropTypes.func,
  searchTerm: PropTypes.string,
};

export default AssetList;
