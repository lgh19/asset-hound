import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Typography } from '@material-ui/core';
import { localPropTypes } from '../../../utils';
import Link from '../../Link';

const Subtitle = styled(props => (
  <Typography variant="subtitle1" {...props} noWrap/>
))`
  padding: 4px;
  font-weight: 600;
  vertical-align: baseline;
`;

const Emoji = styled.span`
  margin-right: 8px;
`;

function ContactInfo({ resource, map }) {
  const parsedNumber = resource.phoneNumber
    ? parsePhoneNumberFromString(resource.phoneNumber)
    : undefined;

  return (
    <div>
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
      {!map &&
        resource.locations.features.map((location, i) => (
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
    </div>
  );
}

ContactInfo.propTypes = {
  resource: localPropTypes.resource.isRequired,
  map: PropTypes.bool,
};

export default ContactInfo;
