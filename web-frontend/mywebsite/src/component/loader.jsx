const Loader = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",   // make it cover the screen
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        zIndex: 1050,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // optional overlay
      }}
    >
      <div
        className="spinner-border loader"
        role="status"
        style={{ width: "4rem", height: "4rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
