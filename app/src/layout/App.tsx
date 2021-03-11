import React from "react";
import "../App.less";
import { BrowserRouter, Route } from "react-router-dom";
import { Web3Provider } from "@ethersproject/providers";
import { VeramoWeb3Provider } from "../web3/VeramoWeb3Provider";
import { QueryClientProvider, QueryClient } from "react-query";
import { Web3ReactProvider } from "@web3-react/core";
import Frame from "./Frame";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <VeramoWeb3Provider>
          <BrowserRouter>
            <Route component={Frame} />
          </BrowserRouter>
        </VeramoWeb3Provider>
      </Web3ReactProvider>
    </QueryClientProvider>
  );
}

export default App;
