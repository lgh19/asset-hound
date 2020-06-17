/**
 *
 * CategorySection
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
import Typography from '../Typography';
import { localPropTypes } from '../../utils';
import BackToTopButton from '../BackToTopButton';

const Wrapper = styled.div`
  margin-top: 24px;
`;

const SectionHeader = styled.div`
  margin-top: 24px;
  border-top: 1px solid dimgray;
  padding-top: 8px;
  display: -ms-flex;
  display: -webkit-flex;
  display: flex;
`;

function CategorySection({ category, children }) {
  return (
    <Wrapper>
      <SectionHeader>
        <div style={{marginRight: '8px'}}>
          <img
            style={{ height: '2rem', display: 'inline' }}
            src={category.image}
          />
        </div>
        <div style={{flex: 1}}>
          <Typography.H3 id={category.slug}>{category.name}</Typography.H3>
        </div>
        <div>
          <BackToTopButton />
        </div>
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
