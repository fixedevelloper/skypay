'use client'
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider, useSnackbar } from "notistack";
import {ReactNode, useEffect} from "react";
import {setupAxiosInterceptors} from "../utils/axiosServices";

export type ChildrenType = Readonly<{ children: ReactNode }>
const AxiosInterceptorProvider = () => {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setupAxiosInterceptors(enqueueSnackbar);
    }, [enqueueSnackbar]);

    return null;
};

const AppProvidersWrapper = ({ children }: ChildrenType) => {
    return (
        <SessionProvider>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                autoHideDuration={4000}
            >
                <AxiosInterceptorProvider /> {/* Avant children */}
                {children}
            </SnackbarProvider>
        </SessionProvider>
    );
};

export default AppProvidersWrapper;