import "./App.css";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Segoe UI', sans-serif;
    background-color: #f9f9f9;
    color: #333;
    line-height: 1.5;
    overflow-x: hidden;
  }

  ul, ol {
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button, input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
  }
`;

function App() {
    return (
        <>
            <GlobalStyle />
            <MainLayout />
        </>
    );
}

export default App;
