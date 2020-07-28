/**
 *
 * MapFilter
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { View, Header, ListBox, Item } from '@adobe/react-spectrum';
import { categorySchema } from '../../schemas';

function MapFilter({ onChange, categories, filters }) {
  function handleChange(selected) {
    onChange(Array.from(selected));
  }

  if (!categories || !filters) {
    return <div />;
  }

  return (
    <View>
      <Header>Filter by Category</Header>
      <ListBox
        selectionMode="multiple"
        aria-label="Pick an animal"
        items={categories}
        selectedKeys={filters}
        // selectedKeys={Object.entries(filters).red8}
        onSelectionChange={handleChange}
      >
        {item => <Item key={item.name}>{item.title}</Item>}
      </ListBox>
    </View>
  );
}

MapFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape(categorySchema)).isRequired,
  filters: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default MapFilter;
