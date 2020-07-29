import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    max-height: 100%;
    height: 100%;
    width: 100%;
    display: flex;
  }

  #app {
    display: -ms-flex;
    display: -webkit-flex;
    display: flex;
    min-height: 100%;
    max-height: 100%;
    min-width: 100%;
  }

  .mapboxgl-popup, .mapboxgl-popup-content {
    background: transparent;
    padding: 0;
  }
`;

export default GlobalStyle;
