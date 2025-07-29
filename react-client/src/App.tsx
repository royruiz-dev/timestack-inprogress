import { useEffect, useState } from "react";
import { formatDate, formatTime } from "./utils/format";
import "./App.css";
import BuiltWith from "./components/BuiltWith";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function responseData(apiResponse: any) {
  return apiResponse.data;
}

function getTimeAgoString(lastUpdated: Date): string {
  const timeSinceRefreshInMs = Date.now() - lastUpdated.getTime();
  let remainingSeconds = Math.floor(timeSinceRefreshInMs / 1000);

  const hours = Math.floor(remainingSeconds / 3600);
  remainingSeconds %= 3600;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const timeBlocks = [];

  if (hours > 0) {
    timeBlocks.push(`${hours}h`);
  }
  if (minutes > 0) {
    timeBlocks.push(`${minutes}m`);
  }
  if (seconds > 0 || timeBlocks.length === 0) {
    timeBlocks.push(`${seconds}s`);
  }

  let timeString = "";
  if (timeBlocks.length === 1) {
    timeString = timeBlocks[0];
  } else if (timeBlocks.length === 2) {
    timeString = timeBlocks.join(" ");
  } else {
    timeString = timeBlocks.slice(0, -1).join(" ") + " " + timeBlocks.at(-1);
  }

  return `${timeString} ago`;
}

function TimeData({ label, url }: { label: string; url: string }) {
  const [latency, setLatency] = useState<number | null>(null);

  const { data, error, isFetching, isLoading, refetch } = useQuery({
    queryKey: [label],
    queryFn: async () => {
      const start = performance.now(); // preferred over Date.now() for duration measurement

      const resp = await axios.get(url);
      const output = responseData(resp);

      const end = performance.now();
      setLatency(Math.round(end - start));

      return output;
    },

    // Disables automatic refetching
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeAgo, setTimeAgo] = useState("");

  const handleRefresh = async () => {
    await refetch();
    setLastUpdated(new Date());
  };

  // Clear latency when fetch error occurs
  useEffect(() => {
    if (error) {
      setLatency(null);
    }
    console.log("Latency:", latency, "isLoading:", isLoading, "error:", error);
  }, [latency, isLoading, error]);

  // Update timeAgo string every second based on lastUpdated to show live refresh timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        setTimeAgo(getTimeAgoString(lastUpdated));
      }
    }, 1000); // Updates per second (1000 ms) for real-time display

    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (isLoading) return <p>Loading {label}...</p>;
  if (error)
    return (
      <p>
        Error loading {label} with {error.message}
      </p>
    );

  return (
    <div className="card">
      <h3>{label}</h3>
      <div className="infoGrid">
        <div className="label">🗓️ Date:</div>
        <div className="value">{formatDate(data.currentTime)}</div>
        <div className="label">⏰ Time:</div>
        <div className="value">{formatTime(data.currentTime)}</div>
        <div className="label">🔄 Last Refreshed:</div>
        <div className="value">{lastUpdated && timeAgo}</div>
        <div className="label">⚡︎ Latency:</div>
        <div className="value">{latency !== null ? `${latency} ms` : ""}</div>
      </div>
      {isFetching && <small>Updating...</small>}
      <button onClick={handleRefresh} disabled={isFetching}>
        Refresh
      </button>
    </div>
  );
}

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h2>Current Time from API Endpoints</h2>
        <div className="card-section">
          <TimeData label="Go API" url="/api/go/" />
          <TimeData label="Node API" url="/api/node/" />
        </div>
      </div>
      <BuiltWith />

      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}
    </>
  );
}

export default App;
