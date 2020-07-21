/**
 *
 * CategorySection
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { localPropTypes } from '../../utils';
import BackToTopButton from '../BackToTopButton';

const Wrapper = styled.div`
`;

const SectionHeader = styled.div`
  margin-top: 24px;
  border-top: 1px solid dimgray;
  padding-top: 8px;
    ${({ theme }) => css`
    padding: ${theme.spacing(2)}px;
  `}
`;

const Image = styled.img`
  display: inline;
  ${({ theme }) => css`
    height: ${theme.typography.h3.fontSize};
  `}
`;

function CategorySection({ category, children }) {
  return (
    <Wrapper>
      <SectionHeader>
        <Typography variant="h3" component="h3" id={category.slug}>
          {category.name}
        </Typography>
        <Typography variant="subtitle1">{category.description}</Typography>
      </SectionHeader>
      {children}
    </Wrapper>
  );
}

CategorySection.propTypes = {
  category: localPropTypes.category,
  children: PropTypes.node,
};

export default memo(CategorySection);
