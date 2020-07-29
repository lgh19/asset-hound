/**
 *
 * InfoHeading
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Heading, Header, Text, View } from '@adobe/react-spectrum';
import AssetTypesList from './AssetTypesList';
import { assetTypeSchema, categorySchema } from '../../schemas';
import CategoryIcon from '../CategoryIcon';

function InfoHeading({ name, assetTypes, category }) {
  const color = 'var(--spectrum-global-color-gray-600)';

  return (
    <Header>
      <View>
        <CategoryIcon
          categorySlug={category.name}
          size="XS"
          UNSAFE_style={{ color }}
        />
        <Text marginStart="size-25" UNSAFE_style={{ color }}>
          {category.title}
        </Text>
      </View>
      <Heading marginTop="size-50" level={2}>{name}</Heading>

      <AssetTypesList assetTypes={assetTypes} />
    </Header>
  );
}

InfoHeading.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.shape(categorySchema).isRequired,
  assetTypes: PropTypes.arrayOf(PropTypes.shape(assetTypeSchema)).isRequired,
};

export default memo(InfoHeading);
