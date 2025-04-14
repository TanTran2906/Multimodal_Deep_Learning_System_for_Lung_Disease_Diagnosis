import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdImageSearch } from "react-icons/md";
import { FaFileImage } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { labelMapping } from "../utils/labelMapping";

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

const Preview = styled.img`
    margin-top: 1rem;
    max-width: 100%;
    border-radius: 10px;
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

const ResultBox = styled(motion.div)`
    background-color: #f0fff0;
    padding: 1.2rem;
    margin-top: 2rem;
    border-radius: 10px;
    border-left: 5px solid #2ecc71;
    color: #2d572c;

    h4 {
        margin-bottom: 1rem;
    }

    p {
        margin: 0.4rem 0;
    }
`;

export default function ImagePage() {
    const [model, setModel] = useState("ViT");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [startTime, setStartTime] = useState(null); // Lưu thời gian bắt đầu
    const [endTime, setEndTime] = useState(null); // Lưu thời gian kết thúc

    const mutation = useMutation(async (file) => {
        const formData = new FormData();
        formData.append("model_name", model);
        formData.append("file", file);

        setStartTime(Date.now()); // Ghi nhận thời gian bắt đầu

        const res = await axios.post(
            "http://127.0.0.1:8000/image/predict-image/",
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
        if (mutation.isSuccess) {
            toast.success("Dự đoán ảnh thành công!");
        }
        if (mutation.isError) {
            toast.error("Đã xảy ra lỗi khi dự đoán!");
        }
    }, [mutation.isSuccess, mutation.isError]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.warn("Vui lòng chọn ảnh trước khi gửi.");
            return;
        }

        mutation.mutate(selectedFile);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const duration =
        endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : null; // Tính thời gian chạy

    return (
        <Container>
            <Title>
                <MdImageSearch size={28} />
                Dự đoán bệnh từ ảnh y tế
            </Title>

            {mutation.isSuccess && (
                <ResultBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h4>Kết quả dự đoán:</h4>
                    <p>
                        <strong>Mô hình:</strong> {mutation.data?.data?.model}
                    </p>
                    <p>
                        <strong>Chẩn đoán:</strong>{" "}
                        {labelMapping[mutation.data?.data?.label] ||
                            mutation.data?.data?.label}
                    </p>
                    <p>
                        <strong>Độ chính xác:</strong>{" "}
                        {(mutation.data?.data?.confidence * 100).toFixed(2) +
                            "%"}
                    </p>
                    {duration && (
                        <p>
                            <strong>Thời gian chạy:</strong> {duration} giây
                        </p>
                    )}
                </ResultBox>
            )}

            <Form onSubmit={handleSubmit}>
                <label>Chọn mô hình:</label>
                <Select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                >
                    <option value="ViT">ViT</option>
                    <option value="Lenet">LeNet</option>
                    <option value="MobileNet">MobileNet</option>
                    <option value="DenseNet121">DenseNet121</option>
                    <option value="DenseNet169">DenseNet169</option>
                </Select>

                <SubmitBtn type="submit" disabled={mutation.isLoading}>
                    {mutation.isLoading ? "🔄 Đang dự đoán..." : "📷 Dự đoán"}
                </SubmitBtn>

                <FileInput>
                    <FaFileImage />
                    <span>Chọn ảnh (PNG, JPG...)</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </FileInput>

                {previewUrl && <Preview src={previewUrl} alt="Xem trước ảnh" />}
            </Form>

            <ToastContainer />
        </Container>
    );
}
