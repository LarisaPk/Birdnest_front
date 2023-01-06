import React from "react";
import Canvas from "./components/Canvas";
import PilotsList from "./components/PilotsList";
import axios from "axios";
import "./App.css";
/*Used for development:
const DRONESAPI = "http://localhost:3001/api/drones/now";
const PILOTSAPI = "http://localhost:3001/api/pilots";
*/

const DRONESAPI = "https://birdnest-backend.cyclic.app/api/drones/now";
const PILOTSAPI = "https://birdnest-backend.cyclic.app/api/pilots";

function App() {
  const [allDrones, setAllDrones] = React.useState([]);
  const [pilots, setPilots] = React.useState([]);
  const [loadingPilots, setLoadingPilots] = React.useState(false);
  const [loadingDrones, setLoadingDrones] = React.useState(false);

  // Generic function for fetching data and settitng it to state
  const fetchData = async (url, source, isApiSubscribed, SetState) => {
    try {
      const { data } = await axios({
        method: "get",
        url: url,
        cancelToken: source.token,
      });
      if (isApiSubscribed) {
        // handle success
        console.log("promise fulfilled");
        SetState(data);
        return data;
      }
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log("successfully aborted");
      } else {
        console.log(e);
      }
    }
  };

  // Only fires once on first render
  React.useEffect(() => {
    console.log("All Drones effect, first render");
    setLoadingDrones(true);

    // Used to cancel the subscription
    let isApiSubscribed = true;

    // Used to cancel fetch request calls
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // To be able to set loading to false whed data is ready
    async function asyncCall() {
      const result = fetchData(DRONESAPI, source, isApiSubscribed, setAllDrones);
      if (result) {
        setLoadingDrones(false);
      }
    }
    asyncCall();

    return () => {
      // cancel the subscription
      // It will not try to update the state on an unmounted component
      isApiSubscribed = false;
      // cancel the request before component unmounts
      source.cancel();
    };
  }, []);

  // Fires every time allDrones state changes
  React.useEffect(() => {
    console.log("All Drones effect");

    let isApiSubscribed = true;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // fetching data after state changes with 2 seconds delay
    let timer = setTimeout(() => {
      fetchData(DRONESAPI, source, isApiSubscribed, setAllDrones);
    }, 2000);

    return () => {
      // cancel the subscription
      // It will not try to update the state on an unmounted component
      isApiSubscribed = false;
      // clear the timer to avoid memory leaks
      // (if the component unmounts before the timer expires)
      clearTimeout(timer);
      // cancel the request before component unmounts
      source.cancel();
    };
  }, [allDrones]);

  // Fires on first render, then with 10 seconds intervals
  //(If updates needed more often, use setTimeout the same way as for Drones. So all api calls get to be resolved.)
  React.useEffect(() => {
    console.log("Pilots in NDZ effect");
    setLoadingPilots(true);

    let isApiSubscribed = true;
    let firstRender = true;
    let interval;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    if (firstRender) {
      fetchData(PILOTSAPI, source, isApiSubscribed, setPilots, setLoadingPilots, false);
      firstRender = false;
      setLoadingPilots(false);
    }

    if (!firstRender) {
      // fetching data every 10 seconds after first render
      interval = setInterval(() => {
        fetchData(PILOTSAPI, source, isApiSubscribed, setPilots);
      }, 10000);
    }

    return () => {
      // cancel the subscription
      // It will not try to update the state on an unmounted component
      isApiSubscribed = false;
      // clear the interval to avoid memory leaks
      // (if the component unmounts before the interval expires)
      clearInterval(interval);
      // cancel the request before component unmounts
      source.cancel();
    };
  }, []);

  return (
    <div>
      {loadingDrones ? <h2>Loading...</h2> : <Canvas allDrones={allDrones} />}
      {loadingPilots ? <h2>Loading...</h2> : <PilotsList pilots={pilots} />}
    </div>
  );
}

export default App;
