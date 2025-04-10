// src/pages/HomePage.jsx
import styled from "styled-components";
import { FaRobot, FaImage, FaRandom, FaVoteYea, FaCogs } from "react-icons/fa";
import { Link } from "react-router-dom";

const Container = styled.div`
    padding: 3rem;
    background-color: #f4f9ff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    text-align: center;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #1e3a8a;
    margin-bottom: 1rem;
`;

const Subtitle = styled.p`
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 2rem;
`;

const FeatureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const FeatureCard = styled(Link)`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    text-decoration: none;
    color: #1f2937;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        color: #1e40af;
    }

    svg {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    span {
        display: block;
        font-weight: 500;
    }
`;

const Illustration = styled.img`
    margin-top: 2rem;
    max-width: 420px;
    width: 100%;
    opacity: 0.9;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.02);
    }
`;

export default function HomePage() {
    return (
        <Container>
            <Title>🔮 Chào mừng đến với Hệ thống Dự đoán</Title>
            <Subtitle>
                Hãy chọn một chức năng bên dưới để bắt đầu khám phá!
            </Subtitle>

            <FeatureGrid>
                <FeatureCard to="/text">
                    <FaRobot />
                    <span>Dự đoán Văn bản</span>
                </FeatureCard>

                <FeatureCard to="/image">
                    <FaImage />
                    <span>Dự đoán Ảnh</span>
                </FeatureCard>

                <FeatureCard to="/multimodal">
                    <FaRandom />
                    <span>Đa phương thức</span>
                </FeatureCard>

                <FeatureCard to="/voting">
                    <FaVoteYea />
                    <span>Bầu chọn đa số</span>
                </FeatureCard>

                <FeatureCard to="/maxsat">
                    <FaCogs />
                    <span>Giải pháp MaxSAT</span>
                </FeatureCard>
            </FeatureGrid>
            <Illustration
                src="/icons/ai-illustration.svg"
                alt="AI Illustration"
            />
        </Container>
    );
}
