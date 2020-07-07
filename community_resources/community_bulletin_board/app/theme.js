const getTheme = inDarkMode => ({
  color: {
    primary: '#102f93',
  },
  borderRadius: '4px',
  breakpoints: {
    sm: 'min-width: 576px',
    md: 'min-width: 768px',
    lg: 'min-width: 992px',
    xl: 'min-width: 1200px',
  },
});

export default getTheme(true);
