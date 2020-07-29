/*
 * AppHeader Messages
 *
 * This contains all the text for the AppHeader component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.AppHeader';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the AppHeader component!',
  },
});
