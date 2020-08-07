/**
 *
 * StatusIconList
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  StatusLight,
  Heading,
  Header,
  Link,
  ListBox,
  Item,
  Text,
} from '@adobe/react-spectrum';

function StatusIconList({ items }) {
  function getMessage(name, status, disableMsg) {
    if (status) return name;
    return disableMsg || `Not ${name}`;
  }

  return (
    <View>
      {items.map(({ name, icon: Icon, status, disabledMsg }) => (
        <StatusLight variant={status ? 'positive' : 'negative'}>
          {getMessage(name, status, disabledMsg)}
        </StatusLight>
      ))}
    </View>
  );
}

StatusIconList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      status: PropTypes.bool.isRequired,
      disabledMsg: PropTypes.string,
    }),
  ).isRequired,
};

export default memo(StatusIconList);
