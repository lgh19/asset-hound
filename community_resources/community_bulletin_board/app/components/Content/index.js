/**
 *
 * Content
 *
 * Component for displaying html from backend WYSIWYG content fields
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import purify from 'dompurify';

function Content({ html }) {
  // dompurify and limitations on the backend should prevent any reasonable
  // risk of xss attacks
  const cleanHtml = purify.sanitize(html);
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}

Content.propTypes = {
  html: PropTypes.string,
};

export default memo(Content);
