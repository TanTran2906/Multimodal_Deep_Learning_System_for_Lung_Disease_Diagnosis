import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaRobot, FaFileUpload } from "react-icons/fa";
import { keywordGroups } from "../utils/keywordGroups";
import mammoth from "mammoth";
import DiagnosisMarkdown from "../components/DiagnosisMarkdown";
import { labelMapping } from "../utils/labelMapping";

// Styled Components (giữ nguyên từ bản trước)
const Container = styled.div`
    max-width: 900px;
    margin: auto;
    padding: 2rem;
    font-family: "Segoe UI", sans-serif;
`;

const Title = styled.h2`
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
`;

const Form = styled.form`
    background-color: #f4f9ff;
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const TextArea = styled.textarea`
    width: 100%;
    margin-top: 0.5rem;
    padding: 1rem;
    font-size: 15px;
    border-radius: 8px;
    border: 1px solid #ccc;
    resize: vertical;
    box-sizing: border-box;
`;

const FileInput = styled.label`
    display: inline-flex;
    align-items: center;
    padding: 0.6rem 1rem;
    border: 1px dashed #0077cc;
    border-radius: 6px;
    color: #0077cc;
    margin-top: 1rem;
    cursor: pointer;
    background-color: #f0f8ff;
    transition: background 0.3s;

    &:hover {
        background-color: #d0e9ff;
    }

    input {
        display: none;
    }

    svg {
        margin-right: 8px;
    }
`;

const SubmitBtn = styled.button`
    display: block;
    margin-top: 1.5rem;
    background-color: #0077cc;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background-color: #005fa3;
    }
`;

const TokenGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const Token = styled.button`
    background-color: #e1f5fe;
    border: none;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background-color: #b3e5fc;
    }
`;

const GroupTitle = styled.h4`
    margin-top: 1.5rem;
    color: #444;
`;

const ResultBox = styled(motion.div)`
    background-color: #f0fff0;
    padding: 1.2rem;
    margin-top: 2rem;
    border-radius: 10px;
    border-left: 5px solid #2ecc71;

    h4 {
        margin-bottom: 1rem;
    }

    pre {
        white-space: pre-wrap;
        font-family: inherit;
        background: #fff;
        padding: 0.5rem;
        border-radius: 8px;
        border: 1px solid #ddd;
    }
`;

export default function RAGPage() {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [startTime, setStartTime] = useState(null); // Lưu thời gian bắt đầu
    const [endTime, setEndTime] = useState(null); // Lưu thời gian kết thúc

    const mutation = useMutation(async () => {
        const formData = new FormData();
        if (text.trim()) formData.append("text", text);
        else if (file) formData.append("file", file);
        formData.append("llm_choice", "gemini");
        formData.append("top_k", 5);

        setStartTime(Date.now()); // Ghi nhận thời gian bắt đầu

        const res = await axios.post(
            "http://127.0.0.1:8000/rag/diagnose",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        setEndTime(Date.now()); // Ghi nhận thời gian kết thúc

        return res;
    });

    useEffect(() => {
        if (mutation.isSuccess) toast.success("Chẩn đoán hoàn tất!");
        if (mutation.isError) toast.error("Đã xảy ra lỗi!");
    }, [mutation.isSuccess, mutation.isError]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() && !file) {
            toast.warn("Vui lòng nhập mô tả triệu chứng hoặc tải lên file");
            return;
        }
        mutation.mutate();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFile(file);
        const ext = file.name.split(".").pop().toLowerCase();

        if (ext === "txt") {
            const reader = new FileReader();
            reader.onload = (event) => {
                setText(event.target?.result);
            };
            reader.readAsText(file);
        } else if (ext === "docx") {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const arrayBuffer = event.target?.result;
                const result = await mammoth.extractRawText({ arrayBuffer });
                setText(result.value);
            };
            reader.readAsArrayBuffer(file);
        } else {
            toast.error("❌ Chỉ hỗ trợ file .txt hoặc .docx");
        }
    };

    const handleTokenClick = (token) => {
        setText((prev) => (prev ? prev + ", " + token : token));
    };

    const duration =
        endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : null; // Tính thời gian chạy

    return (
        <Container>
            <Title>
                <FaRobot size={28} />
                Chẩn đoán bệnh bằng RAG
            </Title>

            <Form onSubmit={handleSubmit}>
                <TextArea
                    rows={8}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Nhập triệu chứng hoặc chọn từ gợi ý..."
                />

                <FileInput>
                    <FaFileUpload />
                    <span>Tải file văn bản (.txt hoặc .docx)</span>
                    <input
                        type="file"
                        accept=".txt,.docx"
                        onChange={handleFileChange}
                    />
                </FileInput>

                <SubmitBtn type="submit" disabled={mutation.isLoading}>
                    {mutation.isLoading ? "🔄 Đang xử lý..." : "🤖 Chẩn đoán"}
                </SubmitBtn>
            </Form>

            {keywordGroups.map((group, i) => (
                <div key={i}>
                    <GroupTitle>{group.title}</GroupTitle>
                    <TokenGroup>
                        {group.items.map((token, j) => (
                            <Token
                                key={j}
                                onClick={() => handleTokenClick(token)}
                            >
                                {token}
                            </Token>
                        ))}
                    </TokenGroup>
                </div>
            ))}

            {mutation.isSuccess && mutation.data?.data && (
                <ResultBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h4 style={{ marginTop: "1.5rem" }}>
                        📁 Các ca bệnh tương tự:
                    </h4>
                    {mutation.data?.data?.similar_cases.map((caseItem, idx) => (
                        <div
                            key={idx}
                            style={{
                                marginBottom: "1.2rem",
                                paddingLeft: "0.5rem",
                            }}
                        >
                            <p>
                                <strong>Chẩn đoán:</strong>{" "}
                                {labelMapping[caseItem.label] || caseItem.label}
                            </p>
                            <p>
                                <strong>Độ tương tự:</strong>{" "}
                                {(caseItem.similarity * 100).toFixed(2)}
                                {"%"}
                            </p>
                            <p>
                                <strong>Nội dung:</strong> {caseItem.content}
                            </p>
                        </div>
                    ))}

                    <h4>📋 Chẩn đoán:</h4>
                    <DiagnosisMarkdown
                        content={mutation.data?.data?.diagnosis}
                    />

                    {duration && (
                        <p>
                            <strong>Thời gian chạy:</strong> {duration} giây
                        </p>
                    )}
                </ResultBox>
            )}

            <ToastContainer />
        </Container>
    );
}
