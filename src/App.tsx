import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import { fabric } from "fabric";
import "./App.css";
import { Canvas } from "fabric/fabric-impl";
function App() {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [svgResult, setSvgResult] = useState<string>("");
  useEffect(() => {
    setCanvas(new fabric.Canvas("c"));
  }, []);
  const toSvg = () => {
    if (canvas) {
      canvas.add();
      console.log("canvas: ", canvas);
      try {
        addLogo();
        const result = canvas.toSVG({
          // viewBox: {
          //   x: 80,
          //   y: 80,
          //   width: 250,
          //   height: 250,
          // },
        });
        setSvgResult(result);
        // console.log("result: ", result);
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };
  function openSVG(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      var url = URL.createObjectURL(e.target.files[0]);
      console.log("e.target.files[0]: ", e.target.files[0]);
      console.log("url: ", url);
      let width = 0;
      let height = 0;
      fabric.loadSVGFromURL(url, function (objects, options) {
        objects.forEach(function (svg) {
          console.log("svg: ", svg);
          console.log("svg.width: ", svg.width);
          console.log("svg.height: ", svg.height);
          width = Math.max(svg.width || 0, width);
          height = Math.max(svg.height || 0, height);
          // svg.set({
          //   top: 25,
          //   left: 25,
          //   originX: "center",
          //   originY: "center",
          // });
          if (canvas) {
            canvas.add(svg).renderAll();
          }
        });
        if (canvas) {
          console.log("width: ", width);
          console.log("height: ", height);
          canvas?.setWidth(width);
          canvas?.setHeight(height);
        }
      });
    }
  }
  const addLogo = () => {
    var svgEl = document.body.querySelector("svg") as SVGSVGElement;
    var serializer = new XMLSerializer();
    var svgStr = serializer.serializeToString(svgEl);
    fabric.loadSVGFromString(svgStr, function (objects, options) {
      objects.forEach(function (svg) {
        console.log("svg: ", svg);
        svg.set({
          top: 25,
          left: 25,
          originX: "center",
          originY: "center",
        });

        // svg.scaleToWidth(100);
        // svg.scaleToHeight(100);
        if (canvas) {
          canvas.add(svg).renderAll();
        }
      });
    });
  };
  const genPng = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        width: canvas.width,
        height: canvas.height,
        left: 0,
        top: 0,
        format: "png",
      });
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <div className="App">
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Congratulations your svg here!</h3>
          <p className="py-4">{svgResult}</p>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              OK!
            </label>
          </div>
        </div>
      </div>

      <div className="parent">
        <div className="div1">
          <canvas id="c"></canvas>
        </div>
        <div className="div2">
          <input
            type="file"
            className="file-input w-full max-w-xs"
            onChange={(e) => openSVG(e)}
          />
          <button className="btn" onClick={toSvg} style={{ margin: "0 10px" }}>
            Add watermark
          </button>
          <label htmlFor="my-modal" className="btn">
            Transform Svg
          </label>
          <button className="btn" onClick={genPng} style={{ margin: "0 10px" }}>
            Transform Png
          </button>
        </div>
      </div>
      <svg
        width="48"
        height="46"
        viewBox="0 0 48 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 0L29.6129 17.2746H47.7764L33.0818 27.9508L38.6946 45.2254L24 34.5491L9.30537 45.2254L14.9182 27.9508L0.223587 17.2746H18.3871L24 0Z"
          fill="#1461D5"
        />
      </svg>
    </div>
  );
}

export default App;
