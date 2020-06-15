import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Public Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  p,
  label {
    font-family: 'Muli', Aria, sans-serif;
    line-height: 1.5em;
  }

  .mapboxgl-popup, .mapboxgl-popup-content {
    background: transparent;
    box-shadow: none;
  }
`;

export default GlobalStyle;
