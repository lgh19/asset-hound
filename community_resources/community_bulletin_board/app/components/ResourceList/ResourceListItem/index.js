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

const Wrapper = styled.li`
  padding: 4px 8px;
  border: 1px solid #457b9d;
  margin: 8px;
  border-radius: 4px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
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

function ResourceListItem({ resource }) {
  const parsedNumber = resource.phoneNumber
    ? parsePhoneNumberFromString(resource.phoneNumber)
    : undefined;
  return (
    <Wrapper id={resource.slug}>
      <Title>{resource.name}</Title>
      {!!resource.phoneNumber && (
        <Subtitle>
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          <Emoji role="img" aria-label="Phone number">
            📞
          </Emoji>
          <Link href={parsedNumber.getURI()}>
            {parsedNumber.formatNational()}
          </Link>
        </Subtitle>
      )}
      {!!resource.website && (
        <Subtitle>
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          <Emoji role="img" aria-label="Website link">
            🔗
          </Emoji>
          <Link href={resource.website} title={resource.website}>
            {resource.website}
          </Link>
        </Subtitle>
      )}
      {!!resource.email && (
        <Subtitle>
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          <Emoji role="img" aria-label="email">
            ✉️
          </Emoji>
          <Link href={`mailto:${resource.email}`}>{resource.email}</Link>
        </Subtitle>
      )}
      {resource.locations.features.map((location, i) => (
        <Subtitle>
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          <Emoji role="img" aria-label={`location-${i}`}>
            📍
          </Emoji>
          <Link
            href={`https://www.google.com/maps/dir/?api=1&destination=${
              location.properties.fullAddress
            }`}
          >
            {location.properties.fullAddress}
          </Link>
        </Subtitle>
      ))}
      <Content html={resource.description} />
    </Wrapper>
  );
}

ResourceListItem.propTypes = {
  resource: localPropTypes.resource,
};

export default ResourceListItem;
