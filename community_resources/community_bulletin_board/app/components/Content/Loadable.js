/**
 *
 * Asynchronously loads the component for Content
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
