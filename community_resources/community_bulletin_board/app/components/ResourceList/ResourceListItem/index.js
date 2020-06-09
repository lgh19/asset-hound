/**
 *
 * ResourceListItem
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

import { localPropTypes } from '../../../utils';
import Typography from '../../Typography';
import Link from '../../Link';

const Wrapper = styled.li`
  padding: 4px 0;
`;

const Title = styled.p`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 0;
  font-weight: bold;
`;

function ResourceListItem({ resource }) {
  return (
    <Wrapper>
      <Title>{resource.name}</Title>
      <Subtitle>
        {!!resource.website && (
          <Link href={resource.website}> {resource.website}</Link>
        )}
        {!!resource.website && !!resource.phoneNumber && '  |  '}
        {!!resource.phoneNumber && (
          <Link href={`tel:${resource.phoneNumber}`}>
            {resource.phoneNumber}
          </Link>
        )}
      </Subtitle>
      <Typography.Body>{resource.description}</Typography.Body>
    </Wrapper>
  );
}

ResourceListItem.propTypes = {
  resource: localPropTypes.resource,
};

export default ResourceListItem;
