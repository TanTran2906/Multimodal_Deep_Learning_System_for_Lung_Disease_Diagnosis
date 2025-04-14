import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

const StyledMarkdown = styled.div`
    line-height: 1.6;
    font-size: 15px;

    h2,
    h3,
    h4 {
        color: #2c3e50;
        margin-top: 1rem;
    }

    ul {
        padding-left: 1.2rem;
        margin: 0.5rem 0;
    }

    li {
        margin-bottom: 0.4rem;
    }

    strong {
        color: #34495e;
    }

    pre {
        white-space: pre-wrap;
        background-color: #f9f9f9;
        border-left: 4px solid #0077cc;
        padding: 0.5rem;
        border-radius: 6px;
    }
`;

export default function DiagnosisMarkdown({ content }) {
    return (
        <StyledMarkdown>
            <ReactMarkdown>{content}</ReactMarkdown>
        </StyledMarkdown>
    );
}
