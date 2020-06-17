/*
 * BulletinBoard Messages
 *
 * This contains all the text for the BulletinBoard container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.BulletinBoard';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the BulletinBoard container!',
  },
});
