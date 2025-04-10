import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import TextPage from "../pages/TextPage";
import HomePage from "../pages/HomePage";
import ImagePage from "../pages/ImagePage";
import MultimodalPage from "../pages/MultimodalPage";
import VotingPage from "../pages/VotingPage";
// import DemoPage from "../pages/DemoPage";
import MaxSatPage from "../pages/MaxSATPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="text" element={<TextPage />} />
                    <Route path="image" element={<ImagePage />} />
                    <Route path="multimodal" element={<MultimodalPage />} />
                    <Route path="voting" element={<VotingPage />} />
                    <Route path="maxsat" element={<MaxSatPage />} />
                    {/* <Route path="demo" element={<DemoPage />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
