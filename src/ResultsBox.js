import React, { useState, useEffect } from "react";
import styled from "styled-components";
import qs from "qs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Confetti from "react-dom-confetti";
import { File, User, Activity, Clock } from "react-bytesize-icons";

const config = {
  angle: 90,
  spread: 45,
  startVelocity: 35,
  elementCount: 35,
  decay: 0.75,
};

const List = styled.ul`
  list-style: none;
  margin: 60px 0;
`;

const Item = styled.li`
  padding: 0;
  margin-bottom: 60px;
`;

const Title = styled.p`
  display: flex;
  align-items: center;

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Info = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Meta = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.33);
  margin-top: 15px;
  margin-right: 15px;

  svg {
    margin-right: 6px;
  }
`;

const CopyButton = styled.button`
  border: 0;
  background: none;
  outline: none;
  color: inherit;
  margin-left: 15px;
  line-height: 1;
  padding: 5px 10px 7px;

  &:hover {
    background: white;
    color: #212123;
  }
`;

function ResultItem({ result, token }) {
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(
    () => {
      if (!copied) {
        return null;
      }

      setTimeout(() => {
        setCopied(false);
      }, 4000);
    },
    [copied]
  );

  return (
    <Item>
      <Title>
        <a href={result.magnet}>{result.title}</a>
        {token && (
          <CopyButton
            copied={added}
            onClick={() => {
              if (added) {
                window.location = "https://app.put.io/transfers";
              } else {
                addTransfer(token, result.magnet).then(
                  response => response.status === 200 && setAdded(true)
                );
              }
            }}
          >
            <Confetti active={added} config={config} />
            {!added && <span>Add to put.io</span>}
            {added && <span>Transfer added</span>}
          </CopyButton>
        )}
        {!token && (
          <CopyToClipboard text={result.magnet} onCopy={() => setCopied(true)}>
            <CopyButton copied={copied}>
              <Confetti active={copied} config={config} />
              {!copied && <span>Copy</span>}
              {copied && <span>Done</span>}
            </CopyButton>
          </CopyToClipboard>
        )}
      </Title>

      <Info>
        <Meta>
          <Activity width={16} height={16} /> {result.seeds}
        </Meta>
        <Meta>
          <File width={16} height={16} /> {result.size}
        </Meta>
        <Meta>
          <Clock width={16} height={16} /> {result.date_added}
        </Meta>
        <Meta>
          <User width={16} height={16} /> {result.source}
        </Meta>
      </Info>
    </Item>
  );
}

export function ResultsBox({ results, token }) {
  if (!results) {
    return null;
  }
  return (
    <List>
      {results.map(result => (
        <ResultItem key={result.magnet} result={result} token={token} />
      ))}
    </List>
  );
}

function addTransfer(token, magnetLink) {
  const options = {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: qs.stringify({
      url: magnetLink,
      oauth_token: token,
    }),
  };

  return fetch(`https://api.put.io/v2/transfers/add`, options);
}
