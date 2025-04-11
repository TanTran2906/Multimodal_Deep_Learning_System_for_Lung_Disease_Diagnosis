import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaFileImage } from "react-icons/fa";
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

const SubmitBtn = styled.button`
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

const ClearBtn = styled.button`
    background-color: #f44336;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background-color: #d32f2f;
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
    background-color: ${(props) => (props.selected ? "#90caf9" : "#e1f5fe")};
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

const SelectedSymptoms = styled.div`
    margin-top: 1rem;
    font-size: 15px;
    background: #f9f9f9;
    padding: 0.8rem;
    border-left: 4px solid #0077cc;
    border-radius: 6px;
`;

const ResultBox = styled(motion.div)`
    background-color: #f0fff0;
    padding: 1.2rem;
    margin-top: 2rem;
    border-radius: 10px;
    border-left: 5px solid #2ecc71;
`;

const FileInput = styled.label`
    display: inline-flex;
    align-items: center;
    padding: 0.6rem 1rem;
    border: 1px dashed #0077cc;
    border-radius: 6px;
    color: #0077cc;
    margin-top: 1.2rem;
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

const Preview = styled.img`
    margin-top: 1rem;
    max-width: 100%;
    border-radius: 10px;
`;

export default function RAGPage() {
    const [symptoms, setSymptoms] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const mutation = useMutation(async () => {
        const formData = new FormData();
        formData.append("text", symptoms.join(", "));

        if (imageFile) {
            formData.append("image", imageFile);
        }

        const res = await axios.post(
            "http://127.0.0.1:8000/rag/diagnose",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return res;
    });

    const handleTokenClick = (token) => {
        setSymptoms((prev) =>
            prev.includes(token)
                ? prev.filter((t) => t !== token)
                : [...prev, token]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (symptoms.length === 0) {
            toast.warn("Vui lòng chọn ít nhất một triệu chứng");
            return;
        }

        mutation.mutate();
    };

    const handleClear = () => {
        setSymptoms([]);
        setImageFile(null);
        setImagePreview(null);
        toast.info("Đã xóa toàn bộ triệu chứng và ảnh");
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    return (
        <Container>
            <Title>
                <MdOutlineMedicalServices size={28} />
                Hệ thống RAG chẩn đoán bệnh
            </Title>

            <Form onSubmit={handleSubmit}>
                <p>Chọn triệu chứng từ danh sách gợi ý:</p>

                {keywordGroups.map((group, i) => (
                    <div key={i}>
                        <GroupTitle>{group.title}</GroupTitle>
                        <TokenGroup>
                            {group.items.map((token, j) => (
                                <Token
                                    key={j}
                                    selected={symptoms.includes(token)}
                                    onClick={() => handleTokenClick(token)}
                                    type="button"
                                >
                                    {token}
                                </Token>
                            ))}
                        </TokenGroup>
                    </div>
                ))}

                {symptoms.length > 0 && (
                    <SelectedSymptoms>
                        <strong>Đã chọn:</strong> {symptoms.join(", ")}
                    </SelectedSymptoms>
                )}

                <FileInput>
                    <FaFileImage />
                    <span>Chọn ảnh X-quang (tuỳ chọn)</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </FileInput>

                {imagePreview && (
                    <Preview src={imagePreview} alt="Xem trước ảnh" />
                )}

                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "1.5rem",
                    }}
                >
                    <SubmitBtn type="submit" disabled={mutation.isLoading}>
                        {mutation.isLoading
                            ? "🔄 Đang chẩn đoán..."
                            : "🧠 Chẩn đoán RAG"}
                    </SubmitBtn>

                    {(symptoms.length > 0 || imageFile) && (
                        <ClearBtn type="button" onClick={handleClear}>
                            🧹 Xóa tất cả
                        </ClearBtn>
                    )}
                </div>
            </Form>

            {mutation.isSuccess && mutation.data?.data && (
                <ResultBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h4>🩺 Kết quả RAG:</h4>
                    <p>
                        <strong>Chẩn đoán:</strong>{" "}
                        {mutation.data.data.diagnosis}
                    </p>
                    <p>
                        <strong>Độ tin cậy:</strong>{" "}
                        {(mutation.data.data.confidence * 100).toFixed(2)}%
                    </p>
                    <p>
                        <strong>Mức độ tự tin:</strong>{" "}
                        {mutation.data.data.confidence_level}
                    </p>
                    <p>
                        <strong>Triệu chứng phát hiện:</strong>{" "}
                        {mutation.data.data.symptoms?.join(", ")}
                    </p>
                </ResultBox>
            )}

            <ToastContainer />
        </Container>
    );
}
