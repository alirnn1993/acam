import React, {createContext, useContext, useEffect, useReducer, useState} from "react";
import {UserApi} from "../utils/UserApi";


const AuthContext = createContext(null);
const AuthProvider = ({children}) => {
    const [state, setState] = React.useState({
        status: 'non',
        error: null,
        user: null,
        loggedIn: false,
        loggedOut: false
    });
    const [loggedIn, setLoggedIn] = useState(false);
    const updateUser = (name) => {
        setState({...state, user: {...state.user, name: name}});
    }
    const login = async (data, error, showMessage) => {
        setState({
            status: 'pending', error: null, user: null, loggedIn: false
        });
        const response = async (result) => {
           await showMessage(data);
            localStorage.setItem("token", result.data.accessToken);
            setLoggedIn(true);
            setState({
                status: 'success', error: null, user: result.data.user, loggedIn: true
            });

        }
        const innerError = (e) => {
            setState({
                status: 'non', error: true, user: null, loggedIn: false
            });
            error(e);
        }
        await UserApi.login(data, response, innerError);
    } // make a login request
    const check = async (data, error, showMessage) => {
        setState({
            status: 'pending', error: null, user: null, loggedIn: false
        });
        const response = async (data) => {
            await showMessage(data);
            setLoggedIn(true);
            setState({
                status: 'success', error: null, user: data.data.user.original.user, loggedIn: true
            });
            localStorage.setItem("token", data.data.user.original.access_token);
        }
        const innerError = () => {
            setState({
                status: 'non', error: true, user: null, loggedIn: false
            });
            error();
        }
        await UserApi.check(data, response, innerError);
    }

    const checkUser = async () => {
        setState({
            status: 'pending', error: null, user: null, loggedIn: false
        });
        const response = (result) => {
            setLoggedIn(true);
            setState({
                status: 'success', error: null, user: result.data.user, loggedIn: true
            });
            localStorage.setItem("token", result.data.accessToken);
        }
        const error = () => {
            localStorage.removeItem("token");
            setState({
                status: 'error', error: true, user: null, loggedIn: false
            });
        }
        await UserApi.refresh(response, error);
    }


    const logout = async () => {
        setState({
            status: 'pending', error: null, user: null, loggedIn: false
        });
        const response = (data) => {
            localStorage.removeItem("token");
            setLoggedIn(false);
            setState({
                status: 'success', error: null, user: null, loggedIn: false, loggedOut: true
            });
        }
        const error = () => {
            localStorage.removeItem("token");
            setLoggedIn(false);
            setState({
                status: 'error', error: true, user: null, loggedIn: false, loggedOut: true
            });
        }
        await UserApi.logout(response, error);


    } // clear the token in localStorage and the user data


    return (
        <AuthContext.Provider value={{state, login, logout, loggedIn, checkUser, check, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}


const useAuthState = () => {
    const state = useContext(AuthContext).state;
    const login = useContext(AuthContext).login;
    const logout = useContext(AuthContext).logout;
    const check = useContext(AuthContext).check;
    const checkUser = useContext(AuthContext).checkUser;
    const isPending = state.status === 'pending';
    const loggedOut = state.loggedOut;
    const isError = state.status === 'error';
    const isSuccess = state.status === 'success';
    const isAuthenticated = state.user && isSuccess;
    const updateUser = useContext(AuthContext).updateUser;
    const user = state.user;
    return {
        ...state,
        login, logout, checkUser, check,
        isPending,
        isError,
        isSuccess,
        isAuthenticated,
        user, loggedOut, updateUser
    }
}


export const types = {
    SET_LOGGED_IN: "LOGGED_IN",
    SET_LOGGED_OUT: "LOGGED_OUT"
};


export {AuthProvider, useAuthState, AuthContext};
