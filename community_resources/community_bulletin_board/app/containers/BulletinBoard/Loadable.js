/**
 *
 * Asynchronously loads the component for BulletinBoard
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
