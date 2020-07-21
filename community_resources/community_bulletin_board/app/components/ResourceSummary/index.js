/**
 *
 * ResourceSummary
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { localPropTypes } from '../../utils';
import Content from '../Content';
import ContactInfo from '../ResourceList/ResourceListItem/ContactInfo';

const Wrapper = styled(Paper)`
  ${({ theme, map }) =>
    map &&
    css`
      padding: ${theme.spacing(2, 2, 2, 2)};
    `}
`;

const Short = styled.div`
  position: relative;
  overflow: hidden;
  max-height: 6rem;
`;

const Fade = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  display: inline-block;
  background-image: linear-gradient(
    rgba(100%, 100%, 100%, 0),
    rgba(100%, 100%, 100%, 0),
    rgba(100%, 100%, 100%, 1)
  );
`;

function ResourceSummary({ resource, map, onMoreClick }) {
  function handleClick() {
    onMoreClick(resource.slug);
  }

  return (
    <Wrapper map={map}>
      <Typography variant="h6">{resource.name}</Typography>
      <ContactInfo resource={resource} map={map} />
      {resource.description && (
        <Short>
          <Fade />
          <Content n html={resource.description} />
        </Short>
      )}

      <CardActions>
        <Button onClick={handleClick}>More Info</Button>
      </CardActions>
    </Wrapper>
  );
}

ResourceSummary.propTypes = {
  resource: localPropTypes.resource,
  map: PropTypes.bool,
  onMoreClick: PropTypes.func,
};

export default ResourceSummary;
