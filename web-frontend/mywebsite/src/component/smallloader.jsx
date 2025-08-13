import React from "react";

const SmallLoader = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          marginBottom: "1rem",
          fontSize: "1.5rem",
          fontWeight: "600",
        }}
      >
        Loading..
      </h2>

      <div
        style={{
          width: "10.5rem",
          height: "0.4rem",
          backgroundColor: "#e0e0e0",
          overflow: "hidden",
          borderRadius: "8px",
          boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "3rem",
            backgroundColor: "#0d6efd",
            borderRadius: "8px",
            animation: "slide 1.2s infinite ease-in-out",
          }}
        ></div>
      </div>

      <style>{`
        @keyframes slide {
          0% {
            transform: translateX(-3rem);
          }
          50% {
            transform: translateX(10rem);
          }
          100% {
            transform: translateX(-3rem);
          }
        }
      `}</style>
    </div>
  );
};

export default SmallLoader;
