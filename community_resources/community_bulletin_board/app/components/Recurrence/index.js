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

function Recurrence({ rrule, allDay, startTime, endTime }) {
  const recurrence = rrulestr(rrule);
  let timeStatement = '';
  if (allDay || (!startTime && !endTime)) timeStatement = 'all day.';
  else if (startTime && endTime)
    timeStatement = `from ${startTime} to ${endTime}.`;
  else if (startTime) timeStatement = `at ${startTime}.`;
  else if (endTime) timeStatement = `until ${endTime}.`;

  return (
    <span>
      Happens {recurrence.toText()} {timeStatement}
    </span>
  );
}

Recurrence.propTypes = {
  rrule: PropTypes.string.isRequired,
  allDay: PropTypes.bool,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
};

export default Recurrence;
