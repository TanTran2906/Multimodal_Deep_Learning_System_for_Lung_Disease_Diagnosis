import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useMutation } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { FaFileImage, FaFileUpload } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import mammoth from "mammoth";
import { keywordGroups } from "../utils/keywordGroups";
import { labelMapping } from "../utils/labelMapping";
import VotingExplanationTooltip from "../components/VotingExplanationTooltip";

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

    label {
        display: block;
        margin-top: 0.5rem;
    }
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
    background-color: #fffaf0;
    padding: 1.2rem;
    margin-top: 2rem;
    border-radius: 10px;
    border-left: 5px solid #f39c12;

    h4 {
        margin-bottom: 1rem;
    }

    p {
        margin: 0.4rem 0;
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

export default function VotingPage() {
    const [model, setModel] = useState("resnet_sbert");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [text, setText] = useState("");
    const [textFile, setTextFile] = useState(null);
    const [startTime, setStartTime] = useState(null); // Lưu thời gian bắt đầu
    const [endTime, setEndTime] = useState(null); // Lưu thời gian kết thúc

    const mutation = useMutation(async () => {
        if (!imageFile) throw new Error("Chưa có ảnh");

        const formData = new FormData();
        formData.append("model_name", model);
        formData.append("image", imageFile);
        if (text.trim()) {
            formData.append("text", text);
        } else if (textFile) {
            formData.append("text_file", textFile);
        }
        setStartTime(Date.now()); // Ghi nhận thời gian bắt đầu

        const res = await axios.post(
            "http://127.0.0.1:8000/voting/predict-voting/",
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
        if (mutation.isSuccess) toast.success("Dự đoán thành công!");
        if (mutation.isError) toast.error("Dự đoán thất bại!");
    }, [mutation.isSuccess, mutation.isError]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!imageFile || (!text.trim() && !textFile)) {
            toast.warn("Cần cung cấp cả ảnh X-quang và mô tả triệu chứng");
            return;
        }

        mutation.mutate();
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleTextFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setTextFile(file);

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
            toast.error("❌ Định dạng không hỗ trợ (.txt hoặc .docx)");
        }
    };

    const handleTokenClick = (token) => {
        setText((prev) => (prev ? prev + ", " + token : token));
    };

    const modelLabels = {
        resnet_sbert: "ResNet + SBERT",
        mobilenet_sbert: "MobileNet + SBERT",
        densenet121_sbert: "DenseNet121 + SBERT",
        densenet169_sbert: "DenseNet169 + SBERT",
    };

    const duration =
        endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : null; // Tính thời gian chạy

    return (
        <Container>
            <Title>
                <MdOutlineIntegrationInstructions size={28} />
                Dự đoán bệnh đa phương thức
            </Title>

            <Form onSubmit={handleSubmit}>
                <FileInput>
                    <FaFileImage />
                    <span>Chọn ảnh X-quang</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </FileInput>

                {imagePreview && (
                    <Preview src={imagePreview} alt="Preview ảnh" />
                )}

                <label>Mô tả triệu chứng:</label>
                <TextArea
                    rows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Nhập triệu chứng hoặc tải file..."
                />

                <FileInput>
                    <FaFileUpload />
                    <span>Tải file văn bản (.txt hoặc .docx)</span>
                    <input
                        type="file"
                        accept=".txt,.docx"
                        onChange={handleTextFileChange}
                    />
                </FileInput>

                <SubmitBtn type="submit" disabled={mutation.isLoading}>
                    {mutation.isLoading ? "🔄 Đang dự đoán..." : "🤖 Dự đoán"}
                </SubmitBtn>
            </Form>

            {/* Kết quả dự đoán */}
            {mutation.isSuccess && (
                <ResultBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h4>Kết quả dự đoán:</h4>

                    <p>
                        <strong>Chẩn đoán chính:</strong>{" "}
                        {labelMapping[
                            mutation.data?.data?.final_prediction?.label_name
                        ] || mutation.data?.data?.final_prediction?.label_name}
                    </p>

                    <p>
                        <strong>Top 3 dự đoán:</strong>
                    </p>
                    <ul>
                        {mutation.data?.data?.top_predictions?.top_3?.map(
                            ({ label_id, score }, idx) => {
                                const labelName =
                                    labelMapping[
                                        mutation.data.data.label_mapping?.[
                                            String(label_id)
                                        ]
                                    ] || `Label ${label_id}`;
                                return (
                                    <li key={idx}>
                                        {labelName}: {score} điểm
                                    </li>
                                );
                            }
                        )}
                    </ul>

                    <p>
                        <h2>Thông tin chi tiết:</h2>
                    </p>
                    <VotingExplanationTooltip />
                    <div>
                        <h3>Mô hình ảnh:</h3>
                        {mutation.data?.data?.model_scores?.image_models?.map(
                            (model, idx) => (
                                <div key={idx}>
                                    <strong>
                                        Mô hình{" "}
                                        {idx == 0
                                            ? "DenseNet121"
                                            : "DenseNet169"}
                                    </strong>
                                    :
                                    <ul>
                                        {Object.entries(model).map(
                                            ([label, score], idx) => (
                                                <li key={idx}>
                                                    {labelMapping[
                                                        mutation.data.data
                                                            .label_mapping?.[
                                                            label
                                                        ]
                                                    ] ||
                                                        labelMapping[label] ||
                                                        label}
                                                    : {score} điểm
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )
                        )}
                    </div>

                    <div>
                        <h3>Mô hình văn bản:</h3>
                        {mutation.data?.data?.model_scores?.text_models?.map(
                            (model, idx) => (
                                <div key={idx}>
                                    <strong>
                                        Mô hình{" "}
                                        {idx == 0 ? "FastText" : "Electra"}
                                    </strong>
                                    :
                                    <ul>
                                        {Object.entries(model).map(
                                            ([label, score], idx) => (
                                                <li key={idx}>
                                                    {labelMapping[
                                                        mutation.data.data
                                                            .label_mapping?.[
                                                            label
                                                        ]
                                                    ] ||
                                                        labelMapping[label] ||
                                                        label}
                                                    : {score} điểm
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )
                        )}
                    </div>

                    <div>
                        <h3>Điểm số mô hình kết hợp:</h3>
                        <ul>
                            {Object.entries(
                                mutation.data?.data?.model_scores?.combined ||
                                    {}
                            ).map(([label, score], idx) => (
                                <li key={idx}>
                                    {labelMapping[
                                        mutation.data.data.label_mapping?.[
                                            label
                                        ]
                                    ] ||
                                        labelMapping[label] ||
                                        label}
                                    : {score} điểm
                                </li>
                            ))}
                        </ul>
                    </div>

                    {duration && (
                        <p>
                            <strong>Thời gian chạy:</strong> {duration} giây
                        </p>
                    )}
                </ResultBox>
            )}

            {/* Hiển thị gợi ý triệu chứng */}
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

            <ToastContainer />
        </Container>
    );
}
