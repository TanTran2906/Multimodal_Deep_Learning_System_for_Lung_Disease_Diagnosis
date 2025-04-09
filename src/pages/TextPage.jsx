import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaRobot, FaFileUpload } from "react-icons/fa";
import { MdOutlineMedicalServices } from "react-icons/md";
import { keywordGroups } from "../utils/keywordGroups";

// Styled Components
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

const Select = styled.select`
    padding: 0.5rem;
    border-radius: 6px;
    margin-top: 0.5rem;
    width: 100%;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 1rem;
    font-size: 15px;
    border-radius: 8px;
    border: 1px solid #ccc;
    resize: vertical;
    box-sizing: border-box;
`;

const FileInput = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 1rem;
    cursor: pointer;
    color: #0077cc;

    input {
        display: none;
    }
`;

const SubmitBtn = styled.button`
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

const GroupTitle = styled.h4`
    margin-top: 1.5rem;
    color: #444;
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

const ResultBox = styled(motion.div)`
    background-color: #f0fff0;
    padding: 1.2rem;
    margin-top: 2rem;
    border-radius: 10px;
    border-left: 5px solid #2ecc71;
`;

// Component chính
export default function TextPage() {
    const [text, setText] = useState("");
    const [model, setModel] = useState("FastText");
    const [selectedFile, setSelectedFile] = useState(null);

    const mutation = useMutation(async (file) => {
        const formData = new FormData();
        formData.append("text", text);
        formData.append("model_name", model);
        if (file) {
            formData.append("file", file);
        }

        const res = await axios.post(
            "http://127.0.0.1:8000/text/predict-text/",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return res;
    });

    useEffect(() => {
        if (mutation.isSuccess) {
            toast.success("🎉 Dự đoán thành công!");
        }
        if (mutation.isError) {
            toast.error("❌ Đã xảy ra lỗi!");
        }
    }, [mutation.isSuccess, mutation.isError]);

    const handleTokenClick = (token) => {
        setText((prev) => (prev ? prev + ", " + token : token));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim()) {
            toast.warn("Vui lòng nhập triệu chứng hoặc chọn file .txt");
            return;
        }

        mutation.mutate(selectedFile);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            setText(event.target.result);
        };
        reader.readAsText(file);
    };

    return (
        <Container>
            <Title>
                <MdOutlineMedicalServices size={28} />
                Dự đoán bệnh từ văn bản triệu chứng
            </Title>

            <Form onSubmit={handleSubmit}>
                <label>Chọn mô hình:</label>
                <Select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                >
                    <option value="FastText">FastText</option>
                    <option value="Electra">Electra</option>
                    <option value="DistillBERT">DistillBERT</option>
                </Select>

                <TextArea
                    rows={8}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Nhập triệu chứng hoặc chọn từ gợi ý..."
                />

                <FileInput>
                    <FaFileUpload />
                    <span>Chọn file .txt</span>
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileChange}
                    />
                </FileInput>

                <SubmitBtn type="submit" disabled={mutation.isLoading}>
                    {mutation.isLoading ? "🔄 Đang dự đoán..." : "🤖 Dự đoán"}
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

            {mutation.isSuccess && (
                <ResultBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h4>Kết quả dự đoán:</h4>
                    <p>
                        <strong>Model:</strong> {mutation.data?.data?.model}
                    </p>
                    <p>
                        <strong>Label:</strong> {mutation.data?.data?.label}
                    </p>
                    <p>
                        <strong>Confidence:</strong>{" "}
                        {mutation.data?.data?.confidence}
                    </p>
                </ResultBox>
            )}

            <ToastContainer />
        </Container>
    );
}
