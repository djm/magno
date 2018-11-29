import React, { useState, useEffect } from "react";
import styled, { css, createGlobalStyle, keyframes } from "styled-components";
import { SearchBox } from "./SearchBox";
import { ResultsBox } from "./ResultsBox";

const GlobalStyle = createGlobalStyle`
  * {
		padding: 0;
		margin: 0;
	}

	body {
		font-family: "Andale Mono", Consolas, monospaced;
		padding: 60px;
		max-width: 960px;
		margin: 0 auto;
		background-color: #212123;
		color: #ffffff;
		line-height: 1.6;
	}

	input, button {
		font-family: inherit;
		color: inherit;
	}

	a {
		color: inherit;
	}

	::selection {
		background-color: black;
		color: white;
	}
`;

const turn = keyframes`
	0% {
		transform: rotate(-90deg);
	}

	25% {
		transform: rotate(-30deg);
	}

	50% {
		transform: rotate(-60deg);
	}

	75% {
		transform: rotate(-20deg);
	}

	100% {
		transform: rotate(-10deg);
	}
`;

const Magno = styled.h1`
  font-size: 16px;
  margin-bottom: 30px;
  width: 30px;
  height: 30px;
  display: inline-block;

  span {
    display: block;
    width: 0;
    height: 0;
    transform: ${props =>
      props.loading ? "transform: rotate(-90deg)" : "transform: rotate(0deg)"};
    transition: transform 400ms;
    transform-origin: left center;
    animation: ${props =>
      props.loading
        ? css`
            ${turn} 900ms infinite alternate-reverse
          `
        : "none"};
  }
`;

export function App() {
  const [term, setTerm] = useState();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
      if (!term || term.length === 0) {
        return null;
      }

      setLoading(true);
      setResults([]);
      search(term).then(results => {
        setResults(results);
        setLoading(false);
      });
    },
    [term]
  );

  return (
    <React.Fragment>
      <Magno loading={loading}>
        <span>🧲</span>
      </Magno>
      <SearchBox onSubmit={term => setTerm(term)} />
      <ResultsBox results={results} />
      <GlobalStyle />
    </React.Fragment>
  );
}

function search(term) {
  return fetch(`/.netlify/functions/magno?q=${term}`).then(response => response.json());
}
