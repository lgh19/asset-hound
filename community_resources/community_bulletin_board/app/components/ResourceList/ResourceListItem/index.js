/**
 *
 * ResourceListItem
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Card from '@material-ui/core/Card';
import { CardContent, Hidden } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { localPropTypes } from '../../../utils';
import Content from '../../Content';
import ContactInfo from './ContactInfo';

const Wrapper = styled(Card)`
  cursor: auto;
  // style for Map View
  margin-bottom: 8px;
  ${({ map }) =>
    map &&
    css`
      max-width: 24em;
      margin-bottom: 0;
    `}
`;

Wrapper.propTypes = Card.propTypes;

const ShortenedContent = styled.div`
  position: relative;
  max-height: 8rem;
  display: flex;
  overflow: hidden;
`;

const Mask = styled.div`
  flex: 1;
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0),
    rgba(100%, 100%, 100%, 1)
  );
`;

function ResourceListItem({ map, resource, onMoreInfoCLick }) {
  return (
    <Wrapper
      id={resource.slug}
      map={map}
      variant={map ? 'elevation' : 'outlined'}
    >
      <CardContent>
        <Typography gutterBottom variant={map ? 'h5' : 'h4'} component="h4">
          {resource.name}
        </Typography>
        {!map && <ContactInfo resource={resource} />}
        {map ? (
          <ShortenedContent>
            <Mask />
            <Content html={resource.description} />
          </ShortenedContent>
        ) : (
          <Content html={resource.description} />
        )}
      </CardContent>
      {map && (
        <CardActions>
          <Button onClick={onMoreInfoCLick}>See More Information</Button>
        </CardActions>
      )}
    </Wrapper>
  );
}

ResourceListItem.propTypes = {
  resource: localPropTypes.resource,
  map: PropTypes.bool,
  onMoreInfoCLick: PropTypes.func,
};
ResourceListItem.defaultProps = {
  map: false,
};

export default ResourceListItem;
