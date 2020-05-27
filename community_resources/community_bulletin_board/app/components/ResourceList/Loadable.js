/**
 *
 * Asynchronously loads the component for ResourceList
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
