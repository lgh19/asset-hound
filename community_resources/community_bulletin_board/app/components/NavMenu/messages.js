/*
 * NavMenu Messages
 *
 * This contains all the text for the NavMenu component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.NavMenu';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the NavMenu component!',
  },
});
