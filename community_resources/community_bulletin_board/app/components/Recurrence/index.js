/**
 *
 * Recurrence
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { rrulestr } from 'rrule';

const parseTime = time => moment(time, 'HH:mm:ss').format('LT');

function Recurrence({ rrule, allDay, startTime, endTime }) {
  const recurrence = rrulestr(rrule);
  const parsedStart = parseTime(startTime);
  const parsedEnd = parseTime(endTime);

  let timeStatement = '';
  if (allDay) timeStatement = 'all day.';
  else if (startTime && endTime)
    timeStatement = `from ${parsedStart} to ${parsedEnd}.`;
  else if (startTime) timeStatement = `at ${parsedStart}.`;
  else if (endTime) timeStatement = `until ${parsedEnd}.`;

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
