'use client'
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { ReactNode } from "react";
import { setupAxiosInterceptors } from "../utils/axiosServices";
import SessionProviderWrapper from "./SessionProviderWrapper";
import AxiosInterceptorSetup from "../utils/AxiosInterceptorSetup";

export type ChildrenType = Readonly<{ children: ReactNode }>

const AppProvidersWrapper =( {children} : ChildrenType) => {
  return (
     <SessionProvider>
                <SnackbarProvider  maxSnack={3}
                                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                    autoHideDuration={4000}>
               {children}
                <AxiosInterceptorSetup />
               </SnackbarProvider>
             </SessionProvider>
  );
};

export default AppProvidersWrapper;