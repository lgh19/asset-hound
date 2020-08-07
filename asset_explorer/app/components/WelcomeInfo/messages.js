/*
 * WelcomeInfo Messages
 *
 * This contains all the text for the WelcomeInfo component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.WelcomeInfo';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Welcome to the asset map!',
  },
});
