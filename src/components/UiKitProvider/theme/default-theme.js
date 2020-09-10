const defaultTheme = {
  palette: {
    alert: '#FA4D30',
    base: '#292B32',
    primary: '#1054DE',
    secondary: '#FFD400',
    tertiary: '#FF305A',
    neutral: '#17181C',
  },
  typography: {
    headline: `
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
    `,
    title: `
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
    `,
    bodyBold: `
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
    `,
    body: `
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
    `,
    captionBold: `
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
    `,
    caption: `
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
    `,
  },
};

const defaultTheme2 = {
  palette: {
    alert: '#FA4D30',
    base: '#292B32',
    primary: '#1054DE',
    secondary: '#FFD400',
    tertiary: '#FF305A',
    neutral: '#17181C',
  },
  typography: {
    global: {
      fontFamily: 'Inter',
      fontStyle: 'normal',
    },
    headline: {
      fontWeight: 600,
      fontSize: '20px',
    },
    title: {
      fontWeight: 600,
      fontSize: '16px',
    },
    body: {
      fontWeight: 'normal',
      fontSize: '14px',
    },
    bodyBold: {
      fontWeight: 600,
      fontSize: '14px',
    },
    caption: {
      fontWeight: 'normal',
      fontSize: '12px',
    },
    captionBold: {
      fontWeight: 600,
      fontSize: '12px',
    },
  },
};

export default defaultTheme2;
