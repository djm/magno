import React, { useState } from "react";
import styled from "styled-components";

const Input = styled.input`
  background-color: transparent;
  padding: 15px 0;
  margin: 0;
  outline: 0;
  border: 0;
  width: 100%;
  font-size: 24px;
`;

const KEY_ENTER = 13;
const isIos = () => !!window.navigator.userAgent.match(/iPad|iPhone/i);
export function SearchBox({ onSubmit }) {
  const [term, setTerm] = useState(isIos ? "Search..." : "");
  return (
    <React.Fragment>
      <Input
        type="text"
        value={term}
        onBlur={event =>
          event.target.value.length === 0 ? (term ? setTerm(term) : setTerm("Search...")) : null
        }
        onChange={event => setTerm(event.target.value)}
        onFocus={() => (term === "Search..." ? setTerm("") : setTerm(term))}
        onKeyUp={event => (event.keyCode === KEY_ENTER ? onSubmit(event.target.value) : null)}
        autoFocus={isIos ? false : "autofocus"}
      />
    </React.Fragment>
  );
}
