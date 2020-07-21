/**
 *
 * ResourceDetails
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paper, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import RRule from 'rrule';
import { localPropTypes } from '../../utils';
import ContactInfo from '../ResourceList/ResourceListItem/ContactInfo';
import Content from '../Content';
import Header from '../Header';

const PaperWrapper = styled(Paper)``;

function ResourceDetails({ resource, onClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const Wrapper = PaperWrapper;
  if (!resource) return <div />;

  const timingMessage = resource.recurrence
    ? RRule.fromString(resource.recurrence).toText()
    : undefined;

  return (
    <Dialog fullScreen={fullScreen} onClose={onClose} open>
      <Header title={resource.name} color="secondary" onClose={onClose} />
      <DialogContent>
        <ContactInfo resource={resource} />
        {!!timingMessage && (
          <Typography variant="subtitle1" gutterBottom>
            Happens {timingMessage}.
          </Typography>
        )}
        {resource.description && <Content html={resource.description} />}
      </DialogContent>
    </Dialog>
  );
}

ResourceDetails.propTypes = {
  resource: localPropTypes.resource,
};

export default ResourceDetails;
