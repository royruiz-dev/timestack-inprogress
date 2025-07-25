import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import axios from "axios";

const client = new QueryClient();

function TimeData({ label, url }: { label: string; url: string }) {
  const { data, error, isFetching, isLoading } = useQuery({
    queryKey: [label],
    queryFn: () => axios.get(url).then((res) => res.data),
  });

  if (isLoading) return <p>Loading {label}...</p>;
  if (error)
    return (
      <p>
        Error loading {label} with {error.message}
      </p>
    );

  return (
    <div>
      <p>
        <strong>{label}</strong>: {data.currentTime}
      </p>
      {isFetching && <small>Updating...</small>}
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        <QueryClientProvider client={client}>
          <h2>Current Time from API Endpoints</h2>
          <TimeData label="Go API" url="/api/go/" />
          <TimeData label="Node API" url="/api/node/" />
        </QueryClientProvider>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  );
}

export default App;
