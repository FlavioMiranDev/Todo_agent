import { Route, Routes } from "react-router-dom";
import { ChatLayout } from "../pages/ChatLayout/ChatLayout";

export function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<ChatLayout />} />
      <Route path="/:id" element={<ChatLayout />} />
    </Routes>
  );
}
