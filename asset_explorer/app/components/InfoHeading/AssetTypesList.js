import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { View, Text } from '@adobe/react-spectrum';
import { assetTypeSchema } from '../../schemas';
import CategoryIcon from '../CategoryIcon';

const List = styled.ul`
  list-style: none;
  padding-left: 0;
  & > li {
    display: inline-block;
  }
`;

function Tag({ slug, label }) {
  return (
    <View
      paddingX="size-100"
      borderWidth="thin"
      borderColor="dark"
      borderRadius="regular"
      backgroundColor="gray-300"
    >
      <Text>{label}</Text>
    </View>
  );
}

function AssetTypesList({ assetTypes }) {
  return (
    <List>
      {assetTypes.map(({ name, title }) => (
        <li key={name}>
          <Tag label={title} slug={name} />
        </li>
      ))}
    </List>
  );
}

AssetTypesList.propTypes = {
  assetTypes: PropTypes.arrayOf(PropTypes.shape(assetTypeSchema)),
};

export default AssetTypesList;
