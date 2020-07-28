/**
 *
 * InfoHeading
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Heading, Header } from '@adobe/react-spectrum';
import AssetTypesList from './AssetTypesLine';
import { assetTypeSchema } from '../../schemas';

function InfoHeading({ name, assetTypes }) {
  return (
    <Header>
      <Heading level={2}>{name}</Heading>
      <AssetTypesList assetTypes={assetTypes} />
    </Header>
  );
}

InfoHeading.propTypes = {
  name: PropTypes.string.isRequired,
  assetTypes: PropTypes.arrayOf(PropTypes.shape(assetTypeSchema)).isRequired,
};

export default memo(InfoHeading);
