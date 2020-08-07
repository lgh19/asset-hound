/**
 *
 * ContactCard
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import {
  View,
  Header,
  ListBox,
  Text,
  Flex,
  Link,
  Divider,
} from '@adobe/react-spectrum';

import Location from '@spectrum-icons/workflow/Location';
import Phone from '@spectrum-icons/workflow/DevicePhone';
import WebPage from '@spectrum-icons/workflow/Link';
import Email from '@spectrum-icons/workflow/Email';

const ShortenedText = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: inherit;
  max-width: 100%;
`;

function Item({ Icon, title, label, href }) {
  return (
    <View
      borderWidth="thin"
      borderColor="dark"
      borderRadius="medium"
      marginBottom="size-75"
      aria-label={label}
    >
      <Flex direection="row" width="100%">
        <View
          flex="0 1 small-500"
          padding="size-75"
          borderEndWidth="thin"
          borderColor="dark"
          backgroundColor="gray-300"
          borderTopStartRadius="medium"
          borderBottomStartRadius="medium"
        >
          <Icon size="S" variant="overBackground" />
        </View>
        <View padding="size-75" flex overflow="auto" d>
          <ShortenedText>
            <Link variant="secondary">
              <a href={href} title={title}>
                {title}
              </a>
            </Link>
          </ShortenedText>
        </View>
      </Flex>
    </View>
  );
}

function ContactCard({ email, phone, website, address }) {
  return (
    <View>
      {!!address && (
        <Item
          Icon={Location}
          title={address}
          label="Address"
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            address,
          )}`}
        />
      )}
      {!!phone && (
        <Item Icon={Phone} title={phone} label="Phone" href={`tel:${phone}`} />
      )}
      {!!website && (
        <Item Icon={WebPage} title={website} label="Web Site" href={website} />
      )}
      {!!email && (
        <Item
          Icon={Email}
          title={email}
          label="Email"
          href={`mailto:${email}`}
        />
      )}
    </View>
  );
}

ContactCard.propTypes = {
  email: PropTypes.string,
  phone: PropTypes.string,
  website: PropTypes.string,
  address: PropTypes.string,
};

export default memo(ContactCard);
