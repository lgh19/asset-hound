/**
 *
 * MapFilter
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { ListBox, Item } from '@adobe/react-spectrum';
import { categorySchema } from '../../schemas';

function MapFilter({ onChange, categories, filters, ...props }) {
  function handleChange(selected) {
    onChange(Array.from(selected));
  }

  if (!categories || !filters) {
    return <div />;
  }

  return (
    <ListBox
      selectionMode="multiple"
      aria-label="Pick an animal"
      items={categories}
      selectedKeys={filters}
      onSelectionChange={handleChange}
      {...props}
    >
      {item => <Item key={item.name}>{item.title}</Item>}
    </ListBox>
  );
}

MapFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape(categorySchema)),
  filters: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default MapFilter;
