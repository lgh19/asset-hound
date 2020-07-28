import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@adobe/react-spectrum';
import styled, { css } from 'styled-components';

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

function Legend({ colors, categories }) {
  return (
    <View
      position="absolute"
      bottom="size-400"
      right="size-250"
      borderWidth="thin"
      borderColor="dark"
      borderRadius="medium"
      width="size-1600"
      padding="size-100"
      backgroundColor="default"
      display="inline-block"
    >
      <List>
        {categories.map(category => (
          <li key={category.name} style={{ color: colors[category.name] }}>
            {category.title}
          </li>
        ))}
      </List>
    </View>
  );
}

Legend.propTypes = {
  colors: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.object),
};

export default Legend;
