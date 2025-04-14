import React, { useState } from "react";
import styled from "styled-components";
import { Info } from "lucide-react";

const TooltipWrapper = styled.div`
    position: relative;
    display: inline-block;
`;

const TooltipIcon = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #007bff;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover {
        background-color: rgba(0, 123, 255, 0.1);
        color: #0056b3;
    }

    svg {
        stroke-width: 2;
    }
`;

const TooltipBox = styled.div`
    visibility: ${(props) => (props.visible ? "visible" : "hidden")};
    background-color: #f9f9f9;
    color: #333;
    text-align: left;
    border-radius: 8px;
    padding: 12px;
    width: 300px;
    position: absolute;
    z-index: 100;
    top: 120%;
    left: 0;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
    font-size: 13px;
    line-height: 1.4;
`;

const List = styled.ul`
    padding-left: 18px;
    margin: 6px 0;
`;

const VotingExplanationTooltip = () => {
    const [visible, setVisible] = useState(false);

    return (
        <TooltipWrapper
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            <TooltipIcon>
                <Info size={16} style={{ marginRight: "4px" }} />
                Giải thích cách tính điểm
            </TooltipIcon>
            <TooltipBox visible={visible}>
                <p>
                    <strong>Khởi tạo điểm ban đầu:</strong>
                </p>
                <List>
                    <li>
                        Top-3 nhãn xác suất cao nhất từ mỗi mô hình được chọn.
                    </li>
                    <li>Điểm gán: Nhãn 1 → 3đ, Nhãn 2 → 2đ, Nhãn 3 → 1đ.</li>
                </List>

                <p>
                    <strong>Điều chỉnh điểm dựa trên xác suất:</strong>
                </p>
                <List>
                    <li>
                        Kiểm tra độ chênh lệch giữa các xác suất bằng cách xét
                        chênh lệch tương đối so với trung bình của các cặp(1-2,
                        1-3, 2-3)
                    </li>
                    <li>
                        Nếu cả 3 cặp (1-2, 1-3, 2-3) lệch nhau &le; 10% → chia
                        đều: mỗi nhãn 2đ.
                    </li>
                    <li>
                        Nếu chỉ 1 cặp gần nhau nhất → cộng điểm rồi chia đều cho
                        2 nhãn đó.
                    </li>
                    <li>Nếu không có cặp nào gần → giữ nguyên điểm (3-2-1).</li>
                </List>

                <p>
                    <strong>Tổng hợp điểm từ hai mô hình:</strong>
                </p>
                <List>
                    <li>
                        Điểm sau điều chỉnh từ mô hình <strong>văn bản</strong>{" "}
                        và <strong>hình ảnh</strong>.
                    </li>
                    <li>
                        Tính điểm cuối: <strong>60% văn bản</strong>,{" "}
                        <strong>40% hình ảnh</strong>.
                    </li>
                    <li>Lựa chọn cuối: Dựa trên chẩn đoán có điểm cao nhất.</li>
                </List>
            </TooltipBox>
        </TooltipWrapper>
    );
};

export default VotingExplanationTooltip;
