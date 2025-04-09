import { Outlet, NavLink } from "react-router-dom";
import styled from "styled-components";

const Layout = styled.div`
    display: flex;
    min-height: 100vh;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f9fafb;
`;

const Sidebar = styled.nav`
    width: 250px;
    background: #ffffff;
    padding: 24px;
    border-right: 1px solid #e5e7eb;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
    border-radius: 0 12px 12px 0;
`;

const NavList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const NavItem = styled.li`
    margin-bottom: 16px;

    a {
        text-decoration: none;
        color: #374151;
        font-weight: 500;
        padding: 10px 14px;
        display: block;
        border-radius: 8px;
        transition: all 0.2s;

        &:hover {
            background-color: #f3f4f6;
            color: #2563eb;
        }

        &.active {
            background-color: #2563eb;
            color: white;
        }
    }
`;

const Content = styled.div`
    flex: 1;
    padding: 32px;
`;

export default function MainLayout() {
    return (
        <Layout>
            <Sidebar>
                <NavList>
                    <NavItem>
                        <NavLink to="/text">Dự đoán văn bản</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/image">Dự đoán ảnh</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/multimodal">Đa mô thức</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/voting">Bầu chọn đa số</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/maxsat">Giải pháp MaxSAT</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/demo">Thử nghiệm</NavLink>
                    </NavItem>
                </NavList>
            </Sidebar>
            <Content>
                <Outlet />
            </Content>
        </Layout>
    );
}
