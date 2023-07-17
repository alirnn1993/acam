import React from "react";
import {AuthProvider} from "./AuthContext";
import {DataProvider} from "./DataContext";

const Provider = ({children}) => {

    return (
        <AuthProvider>
            <DataProvider>
                {children}
            </DataProvider>
        </AuthProvider>
    );
};

export default Provider;
