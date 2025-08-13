const Loader = () => {
 return (
  <div
    className="d-flex justify-content-center align-items-center mobileloader"
    style={{
      top: 0,
      left: 0,
      height: "100%",
      width: "100%", 
      zIndex: 1050,  
     
    }}
  >
    <div
      className="spinner-border loader"
      role="status"
      style={{ width: "5rem", height: "5rem" }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

};
export default Loader;
