import { useEffect, useState } from "react";
import "./App.css";
import BuiltWith from "./components/BuiltWith";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function getTimeAgoString(lastUpdated: Date): string {
  const timeSinceRefreshInMs = Date.now() - lastUpdated.getTime();
  let remainingSeconds = Math.floor(timeSinceRefreshInMs / 1000);

  const hours = Math.floor(remainingSeconds / 3600);
  remainingSeconds %= 3600;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const timeBlocks = [];

  if (hours > 0) {
    timeBlocks.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    timeBlocks.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  }
  if (seconds > 0 || timeBlocks.length === 0) {
    timeBlocks.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);
  }

  let timeString = "";
  if (timeBlocks.length === 1) {
    timeString = timeBlocks[0];
  } else if (timeBlocks.length === 2) {
    timeString = timeBlocks.join(" and ");
  } else {
    timeString =
      timeBlocks.slice(0, -1).join(", ") + ", and " + timeBlocks.at(-1);
  }

  return `Refreshed ${timeString} ago`;
}

function TimeData({ label, url }: { label: string; url: string }) {
  const { data, error, isFetching, isLoading, refetch } = useQuery({
    queryKey: [label],
    queryFn: () => axios.get(url).then((res) => res.data),
  });

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeAgo, setTimeAgo] = useState("");

  const handleRefresh = async () => {
    await refetch();
    setLastUpdated(new Date());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        setTimeAgo(getTimeAgoString(lastUpdated));
      }
    }, 1000); // Update every second for real-time display

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
      <p>
        <strong>{label}</strong>: {data.currentTime}
      </p>
      {isFetching && <small>Updating...</small>}
      {lastUpdated && (
        <p>
          <small>{timeAgo}</small>
        </p>
      )}
      <button onClick={handleRefresh}>Refresh</button>
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
