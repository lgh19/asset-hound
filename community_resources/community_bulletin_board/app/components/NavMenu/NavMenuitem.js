import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { localPropTypes } from '../../utils';

const ListItem = styled.li`
  height: 100%;
  width: 100%;
`;

const Button = styled.a`
  display: inline-block;
  vertical-align: baseline;
  border: 1px solid #1d3557;
  width: 100%;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 2px 2px;
  text-align: center;
  padding: 8px;

  &:link,
  &:visited {
    background-color: #f1faee;
    color: #1d3557;
    text-decoration: none;
    display: inline-block;
  }

  &:hover,
  &:active {
    background-color: #a8dadc;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const Icon = styled.img`
  display: block;
  height: 48px;
  margin: 0 auto;
`;

function NavMenuItem({ section }) {
  return (
    <ListItem>
      <Button title={section.name} href={`#${section.slug}`}>
        <Icon src={section.image} alt={section.name} />
        <Typography display="block" variant="button" noWrap>
          {section.name}
        </Typography>
      </Button>
    </ListItem>
  );
}

NavMenuItem.propTypes = {
  section: localPropTypes.category,
};

export default NavMenuItem;
