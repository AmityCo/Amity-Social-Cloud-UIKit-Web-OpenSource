import { createGlobalStyle } from 'styled-components';
import 'react-toggle/style.css';

const GlobalStyle = createGlobalStyle`
@import url("https://rsms.me/inter/inter.css"); 
body {
  font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
}
`;

export default GlobalStyle;
