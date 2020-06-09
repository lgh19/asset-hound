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

const Wrapper = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const Divider = styled.hr`
  color: dimgray;
`;

function ResourceList({ resources }) {
  const lastIndex = resources.length - 1;
  return (
    <Wrapper>
      {!!resources &&
        resources.map((resource, i) => [
          <ResourceListItem resource={resource} />,
          i < lastIndex ? <Divider /> : null,
        ])}
    </Wrapper>
  );
}

ResourceList.propTypes = {
  resources: PropTypes.arrayOf(localPropTypes.resource),
};

export default ResourceList;
