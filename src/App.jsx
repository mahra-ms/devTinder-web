import Body from "./components/Body";
import LogIn from "./components/LogIn";
import Profile from "./components/Profile";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
          <Route path="/feed" element={<Feed />} />
            <Route path="login" element={<LogIn />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requests" element={<Requests />} />
            
            
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
} 

export default App;
