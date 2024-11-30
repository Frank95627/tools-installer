import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Hello</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
