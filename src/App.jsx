import React from "react";
import Canvas from "./components/Canvas";
import PilotsList from "./components/PilotsList";
import axios from "axios";
import "./App.css";

const DRONESAPI = "http://localhost:3001/api/drones/now";
const PILOTSAPI = "http://localhost:3001/api/pilots";

/*Used for development:
const DRONESAPI = "https://birdnest-backend.cyclic.app/api/drones/now";
const PILOTSAPI = "https://birdnest-backend.cyclic.app/api/pilots";
*/
function App() {
  const [allDrones, setAllDrones] = React.useState([]);
  const [pilots, setPilots] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Organising pilots alphabetically by Lastname. used like this: obj.sort( compare );
  function compare(a, b) {
    if (a.lastName < b.lastName) {
      return -1;
    }
    if (a.lastName > b.lastName) {
      return 1;
    }
    return 0;
  }

  React.useEffect(() => {
    console.log("All Drones effect");

    // Used to cancel the subscription
    let isApiSubscribed = true;

    // Used to cancel fetch request calls
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // fetching data after state changes with 2 seconds delay
    let timer = setTimeout(() => {
      axios
        .get(DRONESAPI, {
          cancelToken: source.token,
        })
        .then((response) => {
          if (isApiSubscribed) {
            // handle success
            console.log("promise fulfilled drones");
            setAllDrones(response.data);
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
      // clear the timer to avoid memory leaks
      // (if the component unmounts before the timer expires)
      clearTimeout(timer);
      // cancel the request before component unmounts
      source.cancel();
    };
  }, [allDrones]);

  React.useEffect(() => {
    console.log("Pilots in NDZ effect");
    setLoading(true);

    // Used to cancel the subscription
    let isApiSubscribed = true;

    // Used to cancel fetch request calls
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // fetching data every 10 seconds
    let interval = setInterval(() => {
      axios
        .get(PILOTSAPI, {
          cancelToken: source.token,
        })
        .then((response) => {
          if (isApiSubscribed) {
            // handle success
            console.log("promise fulfilled pilots");
            setPilots(response.data.sort(compare));
            setLoading(false);
          }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("successfully aborted");
          } else {
            console.log(error);
          }
        });
    }, 5000);
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
      <Canvas allDrones={allDrones} />
      <PilotsList pilots={pilots} loading={loading} />
    </div>
  );
}

export default App;
