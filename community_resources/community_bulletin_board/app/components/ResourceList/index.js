/**
 *
 * ResourceList
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ResourceListItem from './ResourceListItem';
import { localPropTypes } from '../../utils';

const List = styled.ul`
  list-style: none;
  padding-left: 0;
`;

function ResourceList({ resources }) {
  return (
    <List>
      {!!resources &&
        resources.map(resource => <ResourceListItem resource={resource} />)}
    </List>
  );
}

ResourceList.propTypes = {
  resources: PropTypes.arrayOf(localPropTypes.resource),
};

export default ResourceList;
