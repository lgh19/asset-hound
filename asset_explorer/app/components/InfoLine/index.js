/**
 *
 * InfoLine
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { View, Text } from '@adobe/react-spectrum';

function InfoLine({ term, value, icon, missingDataMsg }) {
  return (
    <View>
      {!!term && (
        <Text display="inline">
          <b>{term}: </b>
        </Text>
      )}
      {![null, undefined, ''].includes(value) ? (
        <Text display="inline">{value}</Text>
      ) : (
        <Text display="inline">
          <i>{missingDataMsg}</i>
        </Text>
      )}
    </View>
  );
}

InfoLine.propTypes = {
  term: PropTypes.node,
  value: PropTypes.node,
  icon: PropTypes.node,
  missingDataMsg: PropTypes.node,
};

InfoLine.defaultProps = {
  missingDataMsg: 'Not Provided',
};

export default memo(InfoLine);
