import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { RealtimeClient } from "@supabase/realtime-js";

const client = new RealtimeClient(import.meta.env.VITE_REALTIME_URL, {
  params: {
    apikey: import.meta.env.VITE_REALTIME_KEY,
  },
});

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const channel = client.channel("test-channel", {});

    channel.on("broadcast", { event: "test_event" }, ({ payload }) => {
      setCount(payload.Count);
    });

    channel.subscribe((status, err) => {
      if (status === "SUBSCRIBED") {
        console.log("Connected!");
        channel.send({
          type: "broadcast",
          event: "test",
          payload: { message: count },
        });
      }

      if (status === "CHANNEL_ERROR") {
        console.log(
          `There was an error subscribing to channel: ${err?.message}`
        );
      }

      if (status === "TIMED_OUT") {
        console.log("Realtime server did not respond in time.");
      }

      if (status === "CLOSED") {
        console.log("Connection closed");
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [count]);

  return (
    <>
      <div>
        <a target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
