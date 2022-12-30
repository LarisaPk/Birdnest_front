import React from "react";
import Canvas from "./components/Canvas";
import PilotsList from "./components/PilotsList";
import axios from "axios";
import "./App.css";

const dronesApi = "http://localhost:3001/api/drones/now";
const pilotsApi = "http://localhost:3001/api/pilots";

function App() {
  const [allDrones, setAllDrones] = React.useState([]);
  const [pilots, setPilots] = React.useState([]);

  React.useEffect(() => {
    console.log("All Drones effect");

    // Used to cancel the subscription
    let isApiSubscribed = true;

    // Used to cancel fetch request calls
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    let interval = setInterval(() => {
      axios
        .get(dronesApi, {
          cancelToken: source.token,
        })
        .then((response) => {
          if (isApiSubscribed) {
            // handle success
            console.log("promise fulfilled drones");
            setAllDrones(response.data.report.capture.drone);
          }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("successfully aborted");
          } else {
            console.log(error);
          }
        });
    }, 2000);
    return () => {
      // cancel the subscription
      // It will not try to update the state on an unmounted component
      isApiSubscribed = false;
      // clear the interval to avoid memory leaks
      // (if the component unmounts before the interval expires and we don't clear the interval, we would have a memory leak)
      clearInterval(interval);
      // cancel the request before component unmounts
      source.cancel();
    };
  }, []);

  React.useEffect(() => {
    console.log("Pilots in NDZ effect");

    // Used to cancel the subscription
    let isApiSubscribed = true;

    // Used to cancel fetch request calls
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // fetching data every 2 seconds
    let interval = setInterval(() => {
      axios
        .get(pilotsApi, {
          cancelToken: source.token,
        })
        .then((response) => {
          if (isApiSubscribed) {
            // handle success
            console.log("promise fulfilled pilots");
            setPilots(response.data);
          }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("successfully aborted");
          } else {
            console.log(error);
          }
        });
    }, 2000);
    return () => {
      // cancel the subscription
      // It will not try to update the state on an unmounted component
      isApiSubscribed = false;
      // clear the interval to avoid memory leaks
      // (if the component unmounts before the interval expires and we don't clear the interval, we would have a memory leak)
      clearInterval(interval);
      // cancel the request before component unmounts
      source.cancel();
    };
  }, []);

  return (
    <div>
      <Canvas allDrones={allDrones} />
      <PilotsList pilots={pilots} />
    </div>
  );
}

export default App;
