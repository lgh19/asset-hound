/**
 *
 * CategoryIcon
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Building from '@spectrum-icons/workflow/Building';
import Train from '@spectrum-icons/workflow/Train';
import Money from '@spectrum-icons/workflow/Money';
import Home from '@spectrum-icons/workflow/Home';
import Heart from '@spectrum-icons/workflow/Heart';
import Shop from '@spectrum-icons/workflow/Shop';
import Education from '@spectrum-icons/workflow/Education';
import PeopleGroup from '@spectrum-icons/workflow/PeopleGroup';
import Book from '@spectrum-icons/workflow/Book';

function CategoryIcon({ categorySlug, ...iconProps }) {
  const categoryIcons = {
    'non-profit': Building,
    transportation: Train,
    business: Money,
    housing: Home,
    health: Heart,
    food: Shop,
    'education/youth': Education,
    'community-center': PeopleGroup,
    civic: Book,
  };

  const Icon = categoryIcons[categorySlug];

  return <Icon {...iconProps} />;
}

CategoryIcon.propTypes = {
  categorySlug: PropTypes.string.isRequired,
};

export default memo(CategoryIcon);
