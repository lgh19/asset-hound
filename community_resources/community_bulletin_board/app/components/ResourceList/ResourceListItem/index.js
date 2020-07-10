/**
 *
 * ResourceListItem
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { localPropTypes, withMaxWidth } from '../../../utils';
import Link from '../../Link';
import Content from '../../Content';
import ContactInfo from './ContactInfo';

const Wrapper = styled.div`
  padding: 4px 8px;
  margin-top: 8px;
  border: 1px solid black;
  margin-left: 24px;
  background: aliceblue;
  ${({ map }) =>
    map &&
    css`
      max-width: 24em;
      margin-left: 0;
    `}
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
  return (
    <Wrapper id={resource.slug} map={map}>
      <Title>{resource.name}</Title>
      <ContactInfo resource={resource} />
      <Content html={resource.description} />
    </Wrapper>
  );
}

ResourceListItem.propTypes = {
  resource: localPropTypes.resource,
  map: PropTypes.bool,
};
ResourceListItem.defaultProps = {
  map: false,
};

export default ResourceListItem;
