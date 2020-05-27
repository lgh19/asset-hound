/**
 *
 * Asynchronously loads the component for ResourceListItem
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
