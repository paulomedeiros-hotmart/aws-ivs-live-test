import { HashRouter, Route, Routes } from "react-router-dom";
import InputUrlView from "../views/InputUrlView";
import PlayerView from "../views/playerView";
import InteractiveView from "../views/InteractiveView";

export default function AppRoutes () {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<InputUrlView></InputUrlView>} />
                <Route path="/play" element={<PlayerView></PlayerView>} />
                <Route path="/interactive" element={<InteractiveView></InteractiveView>} />
            </Routes>
        </HashRouter>
    )
}