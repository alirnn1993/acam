import './App.css';
import {useAuthState} from "./context/AuthContext";
import {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Dashboard from "./pages/Dashboard";
import TrafficReport from "./pages/TrafficReport";
import UserSetting from "./pages/settings/UserSetting";
import System from "./pages/settings/System";
import TimeNDate from "./pages/settings/TimeNDate";
import Network from "./pages/settings/Network";
import Environment from "./pages/settings/Environment";
import UserManagement from "./pages/settings/UserManagement";
import User from "./pages/settings/User";
import List from "./pages/settings/List";
import ROI from "./pages/settings/ROI";
import Log from "./pages/Log";


function App() {

    const auth = useAuthState();

    useEffect(() => {
        if (localStorage.getItem("token") && !auth.isAuthenticated && !auth.loggedOut) {
            auth.checkUser();
        }
    }, [auth.isAuthenticated]);

    return (
        <Router basename={"/control-panel"}>
            <Routes>
                <Route element={
                    <PublicRoute>
                        <Login/>
                    </PublicRoute>
                } path={"/login"} exact/>


                <Route path={'/'} element={
                    <PrivateRoute>
                        <Main/>
                    </PrivateRoute>}>
                    <Route path={'/dashboard'} element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
                    <Route path={'/traffic-report'} element={<PrivateRoute><TrafficReport/></PrivateRoute>}/>
                    <Route path={'/setting/user'} element={<PrivateRoute><UserSetting/></PrivateRoute>}/>
                    <Route path={'/setting/system'} element={<PrivateRoute><System/></PrivateRoute>}/>
                    <Route path={'/setting/time'} element={<PrivateRoute><TimeNDate/></PrivateRoute>}/>
                    <Route path={'/setting/network'} element={<PrivateRoute><Network/></PrivateRoute>}/>
                    <Route path={'/setting/environment'} element={<PrivateRoute><Environment/></PrivateRoute>}/>
                    <Route path={'/setting/users'} element={<PrivateRoute><UserManagement/></PrivateRoute>}/>
                    <Route path={'/user'} exact element={<PrivateRoute><User/></PrivateRoute>}/>
                    <Route path={'/setting/log'} exact element={<PrivateRoute><Log/></PrivateRoute>}/>
                    <Route path={'/setting/list'} exact element={<PrivateRoute><List/></PrivateRoute>}/>
                    <Route path={'/setting/roi'} exact element={<PrivateRoute><ROI/></PrivateRoute>}/>
                    <Route path={'/user/:id'} exact element={<PrivateRoute><User/></PrivateRoute>}/>

                </Route>


            </Routes>
        </Router>
    );
}

export default App;


const PrivateRoute = ({children}) => {
    const auth = useAuthState();
    return auth.isAuthenticated ? children : <Navigate to="/login"/>;
}

const PublicRoute = ({children}) => {
    const auth = useAuthState();
    return auth.isAuthenticated ? <Navigate to={`/dashboard`}/> : children;
}
