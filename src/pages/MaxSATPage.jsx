import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
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

const ClearBtn = styled.button`
    display: inline-block;
    margin-left: 1rem;
    background-color: #f44336;
    color: white;
    padding: 10px 20px;
    border: none;
    margin-top: 24px;
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

export default function MaxSatPage() {
    const [symptoms, setSymptoms] = useState([]);

    const mutation = useMutation(async (symptomsToSubmit) => {
        const formData = new FormData();
        formData.append("text", symptomsToSubmit);
        const res = await axios.post(
            "http://127.0.0.1:8000/maxsat/diagnose",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return res;
    });

    // Xử lý khi click token - Toggle symptom selection
    const handleTokenClick = (token) => {
        setSymptoms((prev) => {
            if (prev.includes(token)) {
                return prev.filter((t) => t !== token);
            } else {
                return [...prev, token];
            }
        });
    };

    // Only call API when the button is clicked
    const handleSubmit = (e) => {
        e.preventDefault();

        if (symptoms.length === 0) {
            toast.warn("Vui lòng chọn ít nhất một triệu chứng");
            return;
        }

        // Call API only on explicit submission
        mutation.mutate(symptoms);
    };

    const handleClear = () => {
        setSymptoms([]);
        toast.info("Đã xóa toàn bộ triệu chứng đã chọn");
    };

    // Helper function to check if a symptom is selected
    const isSelected = (token) => symptoms.includes(token);

    return (
        <Container>
            <Title>
                <MdOutlineMedicalServices size={28} />
                Dự đoán bệnh với MaxSAT
            </Title>

            <Form onSubmit={handleSubmit}>
                <p>Chọn triệu chứng từ gợi ý bên dưới:</p>

                {keywordGroups.map((group, i) => (
                    <div key={i}>
                        <GroupTitle>{group.title}</GroupTitle>
                        <TokenGroup>
                            {group.items.map((token, j) => (
                                <Token
                                    key={j}
                                    onClick={() => handleTokenClick(token)}
                                    selected={isSelected(token)}
                                    type="button" // Prevent form submission on token click
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

                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                    }}
                >
                    <SubmitBtn type="submit" disabled={mutation.isLoading}>
                        {mutation.isLoading
                            ? "🔄 Đang dự đoán..."
                            : "🤖 Dự đoán"}
                    </SubmitBtn>

                    {symptoms.length > 0 && (
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
                    <h4>🔍 Kết quả MaxSAT:</h4>
                    <p>
                        <strong>Chẩn đoán cuối cùng:</strong>{" "}
                        {mutation?.data?.data?.final_diagnosis}
                    </p>
                    <p>
                        <strong>Mức độ tự tin:</strong>{" "}
                        {mutation?.data?.data?.maxsat_confidence}
                    </p>
                    <p>
                        <strong>Dự đoán MaxSAT:</strong>{" "}
                        {mutation?.data?.data?.maxsat_predictions?.join(", ")}
                    </p>
                    <p>
                        <strong>Dự đoán FastText:</strong>{" "}
                        {mutation?.data?.data?.fasttext_prediction}
                    </p>
                    <p>
                        <strong>Độ tin cậy:</strong>{" "}
                        {(mutation?.data?.data?.confidence * 100).toFixed(2)}%
                    </p>
                    <p>
                        <strong>Triệu chứng phát hiện:</strong>{" "}
                        {mutation?.data?.data?.detected_symptoms?.join(", ")}
                    </p>
                </ResultBox>
            )}

            <ToastContainer />
        </Container>
    );
}
