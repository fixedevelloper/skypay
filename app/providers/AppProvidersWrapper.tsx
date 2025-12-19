"use client";

import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import AxiosInterceptorProvider from "./AxiosInterceptorProvider";

type ChildrenType = {
    children: React.ReactNode;
};

const AppProvidersWrapper = ({ children }: ChildrenType) => {
    return (
        <SessionProvider>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                autoHideDuration={4000}
            >
                <AxiosInterceptorProvider /> {/* ⚠️ AVANT children */}
                {children}
            </SnackbarProvider>
        </SessionProvider>
    );
};

export default AppProvidersWrapper;
