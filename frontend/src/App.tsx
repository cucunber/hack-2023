import "./App.css";
import { observer } from "mobx-react-lite";
import { Register } from "./widgets/register";
import { Route, Routes } from "react-router";
import Auth from "./widgets/auth";
import { CreateHallPage } from "./pages/createHall";
import { Moderator } from "./pages/moderator";
import { HallCardPage } from "./pages/hallCard";
import { NotFound } from "./pages/notFound";

const App = observer(() => {
  return (
    <Routes>
      <Route path="/hall/create" element={<CreateHallPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/moderator" element={<Moderator />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="/hall/:id" element={<HallCardPage />} />
    </Routes>
  );
});

export default App;
