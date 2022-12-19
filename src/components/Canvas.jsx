import React from "react";

function Canvas(props) {
  let canvasWidth = 500; // Width in meters
  let canvasHeight = 500; // Height in meters

  let noFlyZoneRadius = 100; // Radius of NDZ in meters

  let nestPositionX = 250000;
  let nestPositionY = 250000;

  React.useEffect(() => {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");

    // Mark no-fly zone
    context.beginPath();
    context.arc(
      nestPositionX / 1000,
      nestPositionY / 1000,
      noFlyZoneRadius,
      0,
      2 * Math.PI
    );
    context.stroke();

    // Mark nest position - fill in the 5x5 pixel square at nest coordinates converted to meters
    context.fillRect(nestPositionX / 1000, nestPositionY / 1000, 5, 5);

    // Mark drones positions in the area
    props.data.report.capture.drone.map((data) =>
      context.fillRect(
        Math.floor(data.positionX) / 1000,
        Math.floor(data.positionY) / 1000,
        3,
        3
      )
    );
  }, []);

  return (
    <div>
      <h1>Drone positions next to the Monadikuikka nest</h1>
      <canvas
        id="myCanvas"
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "2px solid #d3d3d3" }}
      >
        Your browser does not support the HTML canvas tag.
      </canvas>
    </div>
  );
}

export default Canvas;
