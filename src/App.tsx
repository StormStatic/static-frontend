import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import Chain from "./Chain";
import { Toaster } from "react-hot-toast";

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
        <Chain />
      </ApolloProvider>
    </div>
  );
}

export default App;
