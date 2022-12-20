import React from "react";

function PilotsList(props) {
  const tableRows = props.data.pilots.map((pilot) => (
    <tr key={pilot.pilotId}>
      <td>
        {pilot.firstName} {pilot.lastName}
      </td>
      <td>{pilot.email}</td>
      <td>{pilot.phoneNumber}</td>
      <td>{pilot.closest_distanse_m} merets</td>
    </tr>
  ));

  return (
    <div>
      <h1>Pilots who violated the NDZ perimeter for the past 10 minutes</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email address</th>
            <th>Phone number</th>
            <th>Closest confirmed distance to the nest</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default PilotsList;
