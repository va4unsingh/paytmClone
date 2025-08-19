import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./app/signUp";
import SignIn from "./app/signIn";
import Dashboard from "./app/dashboard";
import SendMoney from "./app/sendMoney";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sendMoney" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
