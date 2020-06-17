import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { localPropTypes } from '../../utils';

const ListItem = styled.li`
  display: table-cell;
  vertical-align: middle;
`;

const Button = styled.a`
  display: inline-block;
  vertical-align: baseline;
  border: 1px solid #1d3557;
  width: 100%;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 2px 2px;
  text-align: center;

  &:link,
  &:visited {
    background-color: #f1faee;
    color: #1d3557;
    padding: 14px 25px;
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

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const IconDiv = styled.div`
  flex: 1 0 32px;
`;

const TextDiv = styled.div`
  flex: 0 1;
`;

const Icon = styled.img`
  height: 48px;
`;

function NavMenuItem({ section }) {
  return (
    <ListItem>
      <Button title={section.name} href={`#${section.slug}`}>
        <ButtonContent>
          <IconDiv>
            <Icon src={section.image} alt={section.name} />
          </IconDiv>
          <TextDiv>{section.name}</TextDiv>
        </ButtonContent>
      </Button>
    </ListItem>
  );
}

NavMenuItem.propTypes = {
  section: localPropTypes.category,
};

export default NavMenuItem;
