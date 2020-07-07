/**
 *
 * ResourceListItem
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { localPropTypes, withMaxWidth } from '../../../utils';
import Link from '../../Link';
import Content from '../../Content';

const Wrapper = styled.div`
  padding: 4px 8px;
  margin: 8px;
  max-width: 24em;
`;

const Title = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const Subtitle = styled.div`
  padding: 4px;
  font-weight: 600;
  vertical-align: baseline;
`;

const Emoji = styled.span`
  margin-right: 8px;
`;

function ResourceListItem({ map, resource }) {
  const parsedNumber = resource.phoneNumber
    ? parsePhoneNumberFromString(resource.phoneNumber)
    : undefined;
  return (
    <Wrapper id={resource.slug} style={map ? { textAlign: 'left' } : {}}>
      <Title>{resource.name}</Title>
      <Content html={resource.description} />
    </Wrapper>
  );
}

ResourceListItem.propTypes = {
  resource: localPropTypes.resource,
};

export default ResourceListItem;
