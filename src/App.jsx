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
  const [pilotsNotReady, setPilotsNotReady] = React.useState(false); // when there is no pilots in NDZ. for ex. on first render

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
      } else if (e.response.data.error === "pilots data is not ready yet") {
        setPilotsNotReady(true);
        console.log(e);
        console.log(e.response.data.error);
        return e.response.data.error;
      }
    }
  };

  // Only fires once on first render
  React.useEffect(() => {
    console.log("First render Drones, Pilots effect");
    setLoadingDrones(true);
    setLoadingPilots(true);
    setPilotsNotReady(false);
    // Used to cancel the subscription
    let isApiSubscribed = true;

    // Used to cancel fetch request calls
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // To be able to set loading to false whed data is ready
    async function asyncCall() {
      const drones = await fetchData(DRONESAPI, source, isApiSubscribed, setAllDrones);
      if (drones) {
        setLoadingDrones(false);
      }
      const pilots = await fetchData(PILOTSAPI, source, isApiSubscribed, setPilots);
      if (pilots) {
        setLoadingPilots(false);
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
    console.log("Drones effect, state change");

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

  // Fires every time pilots state changes
  React.useEffect(() => {
    console.log("Pilots effect, state change");
    setPilotsNotReady(false);

    let isApiSubscribed = true;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // fetching data after state changes with 10 seconds delay
    // (Should be enough to get regular updates for the pilots list. If needed more often, decrease timeout)
    let timer = setTimeout(() => {
      fetchData(PILOTSAPI, source, isApiSubscribed, setPilots);
    }, 10000);

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
  }, [pilots]);

  return (
    <div>
      {loadingDrones ? <h2>Loading...</h2> : <Canvas allDrones={allDrones} />}
      {loadingPilots ? <h2>Loading...</h2> : <PilotsList pilots={pilots} pilotsNotReady={pilotsNotReady} />}
    </div>
  );
}

export default App;
