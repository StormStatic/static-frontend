import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import toast, { Toaster } from "react-hot-toast";

import Home from "./Home";

const HOST = "https://dev-static-api.ap.ngrok.io";
const STATIC_GRAPHQL_URI = `${HOST}/graphql`;
const c = new ApolloClient({
  uri: STATIC_GRAPHQL_URI,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <div className="App">
      <ApolloProvider client={c}>
        <Toaster />
        <Home />
      </ApolloProvider>
    </div>
  );
}

export default App;
