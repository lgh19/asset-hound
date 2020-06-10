import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'react-map-gl';

import styled, { css } from 'styled-components';
import Typography from '../Typography';
import Link from '../Link';

const Wrapper = styled.div`
  text-align: center;
  padding: 4px;
  background: whitesmoke;
  border-radius: 4px;
  box-shadow: 1px 1px 2px 2px rgb(0, 0, 0, 0.3);
`;

const Text = styled(Typography)`
  font-size: 0.8rem;
  margin: 0;
  padding: 0;
`;

function PopUp({ name, lat, lng, onClose }) {
  return (
    <Popup
      latitude={lat}
      longitude={lng}
      closeOnClick={false}
      onClose={onClose}
      closeButton={false}
      tipSize={0}
      anchor="bottom"
      interactiveLayers={['asset-points']}
      style={{ padding: 0 }}
    >
      <Wrapper>
        <Text>{name}</Text>
      </Wrapper>
    </Popup>
  );
}

PopUp.propTypes = {
  name: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  onClose: PropTypes.func,
};

export default PopUp;
