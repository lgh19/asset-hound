/**
 *
 * Recurrence
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { rrulestr } from 'rrule';
import Typography from '../Typography';

function Recurrence({ rrule }) {
  return <Typography.Body>{rrulestr(rrule).toText()}</Typography.Body>;
}

Recurrence.propTypes = {
  rrule: PropTypes.string.isRequired,
};

export default Recurrence;
