import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
// import { BooksPage } from "./pages/BooksPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/books" element={<BooksPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
