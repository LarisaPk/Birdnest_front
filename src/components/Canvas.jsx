import React from "react";

function Canvas(props) {
  const canvasWidth = 500; // Width in meters
  const canvasHeight = 500; // Height in meters

  const noFlyZoneRadius = 100; // Radius of NDZ in meters

  const nestPositionX = 250000;
  const nestPositionY = 250000;

  React.useEffect(() => {
    const canvas = document.getElementById("myCanvas");
    const context = canvas.getContext("2d");
    // clear canvas before displaying new positions of the drones
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Display no-fly zone
    context.beginPath();
    context.arc(nestPositionX / 1000, nestPositionY / 1000, noFlyZoneRadius, 0, 2 * Math.PI);
    context.stroke();

    // Display nest position - fill in the 5x5 pixel square at nest coordinates converted to meters
    //context.fillRect(nestPositionX / 1000, nestPositionY / 1000, 5, 5);

    // set the canvas context's font-size and font-face
    context.font = "1.5em Arial";
    context.fillText("🐣", nestPositionX / 1000, nestPositionY / 1000);

    // Display drones positions in the area
    props.allDrones.map((drone) =>
      context.fillText("🚁", Math.floor(drone.positionX._text) / 1000, Math.floor(drone.positionY._text) / 1000)
    );

    context.textAlign = "center";
  });

  return (
    <div>
      <h2>Drones next to the Monadikuikka nest now</h2>
      <canvas
        id="myCanvas"
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "2px solid #454B1B", backgroundColor: "rgb(175, 225, 175)" }}
      >
        Your browser does not support the HTML canvas tag.
      </canvas>
    </div>
  );
}

export default Canvas;
