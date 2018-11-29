import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
            copied={copied}
            onClick={() => {
              setCopied(true);
              addTransfer(token, result.magnet);
            }}
          >
            <Confetti active={copied} config={config} />
            Add to put.io
          </CopyButton>
        )}
        {!token && (
          <CopyToClipboard text={result.magnet} onCopy={() => setCopied(true)}>
            <CopyButton copied={copied}>
              <Confetti active={copied} config={config} />
              {!copied && <span>copy</span>}
              {copied && <span>done</span>}
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

function addTransfer(token, url) {
  fetch(`https://api.put.io/v2/transfers/add?oauth_token=${token}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: url }),
  }).then(res => console.log(res));
}
