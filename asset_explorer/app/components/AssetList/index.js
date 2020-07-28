/**
 *
 * AssetList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { ListBox, Item, View, Text, Divider } from '@adobe/react-spectrum';
import Building from '@spectrum-icons/workflow/Building';
import Train from '@spectrum-icons/workflow/Train';
import Money from '@spectrum-icons/workflow/Money';
import Home from '@spectrum-icons/workflow/Home';
import Heart from '@spectrum-icons/workflow/Heart';
import Book from '@spectrum-icons/workflow/Book';
import PeopleGroup from '@spectrum-icons/workflow/PeopleGroup';
import Shop from '@spectrum-icons/workflow/Shop';
import Education from '@spectrum-icons/workflow/Education';

// import messages from './messages';
const SIZE = 'L';

function AssetList({
  assets,
  currentAsset,
  isLoading,
  onLoadMore,
  onSelectAsset,
}) {
  const categoryIcons = {
    'non-profit': <Building size={SIZE} />,
    transportation: <Train size={SIZE} />,
    business: <Money size={SIZE} />,
    housing: <Home size={SIZE} />,
    health: <Heart size={SIZE} />,
    food: <Shop size={SIZE} />,
    'education/youth': <Education size={SIZE} />,
    'community-center': <PeopleGroup size={SIZE} />,
    civic: <Book size={SIZE} />,
  };

  /**
   * Extracts selected id from the set of selected keys that `ListBox` passes
   * and calls the `onSelectAsset` prop with it as its argument.
   * @param {Set} selectedKeys
   */
  function handleSelectionChange(selectedKeys) {
    const selectedKeysArr = Array.from(selectedKeys);
    if (selectedKeysArr.length) onSelectAsset(Array.from(selectedKeys)[0]);
  }

  return (
    <ListBox
      selectedKeys={currentAsset ? [`${currentAsset.id}`] : undefined}
      selectionMode="single"
      aria-label="Select an asset"
      items={assets}
      isLoading={isLoading}
      onLoadMore={onLoadMore}
      onSelectionChange={handleSelectionChange}
    >
      {item => (
        <Item key={item.id} textValue={item.name}>
          {categoryIcons[item.category.name]}
          <Text>{item.name}</Text>
          <Text slot="description">{item.category.title}</Text>
        </Item>
      )}
    </ListBox>
  );
}

AssetList.propTypes = {
  assets: PropTypes.arrayOf(PropTypes.object),
  currentAsset: PropTypes.object,
  isLoading: PropTypes.bool,
  onLoadMore: PropTypes.func,
  onSelectAsset: PropTypes.func,
};

export default AssetList;
