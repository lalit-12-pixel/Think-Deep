import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Signup = () => {
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errors, setErrors] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current.value,
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      confirmPassword: confirmPasswordRef.current.value,
    };

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        navigate("/login");
      } else {
        if (passwordRef.current) passwordRef.current.value = "";
        if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
        setErrors(data.errors || [{ msg: data.error || "Signup failed. Please try again." }]);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrors([{ msg: "Something went wrong. Please try again." }]);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <>
      <Helmet><title>Create Your Account</title></Helmet>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-6" style={{ maxWidth: "650px", width: "100%" }}>
            <div className="shadow-sm onmobile" style={{ borderRadius: "20px", padding: "2rem 1.7rem", margin: "80px auto", border: "1px solid #686767ff" }}>
              <h2 className="text-center mb-4 fw-bold" style={{ fontSize: "1.7rem", userSelect: "none" }}>Create Your Account</h2>

              {errors.length > 0 && (<div className="alert alert-danger"><ul className="mb-0">{errors.map((err, index) => <li key={index}>{err.msg || err}</li>)}</ul></div>)}

              <form onSubmit={handleSignup}>
                <div className="mb-3"><input type="text" ref={nameRef} placeholder="Name" style={{ padding: "10px", fontSize: "0.9rem", width: "100%", borderRadius: "6px", border: "0.5px solid #686767ff" }} required /></div>
                <div className="mb-3"><input type="text" ref={usernameRef} placeholder="Username" style={{ padding: "10px", fontSize: "0.9rem", width: "100%", borderRadius: "6px", border: "0.5px solid #686767ff" }} required /></div>
                <div className="mb-3"><input type="email" ref={emailRef} placeholder="Email" style={{ padding: "10px", fontSize: "0.9rem", width: "100%", borderRadius: "6px", border: "0.5px solid #686767ff" }} required /></div>
                <div className="mb-3"><input type="password" ref={passwordRef} placeholder="Password" style={{ padding: "10px", fontSize: "0.9rem", width: "100%", borderRadius: "6px", border: "0.5px solid #686767ff" }} required /></div>
                <div className="mb-3"><input type="password" ref={confirmPasswordRef} placeholder="Confirm Password" style={{ padding: "10px", fontSize: "0.9rem", width: "100%", borderRadius: "6px", border: "0.5px solid #686767ff" }} required /></div>
                <button type="submit" className="btn btn-success w-100 mb-2" style={{ padding: "10px", fontSize: "0.95rem", fontWeight: "500" }}>Sign Up</button>
              </form>

              <div className="text-center mb-2">or</div>

              <button type="button" onClick={handleGoogleSignup} className="w-100 d-flex align-items-center justify-content-center gap-2" style={{ padding: "10px", fontSize: "0.95rem", background: "#fff", borderRadius: "8px", border: "1px solid #ccc", fontWeight: "600" }}>
                <img src="/google.png" alt="Google" style={{ width: "2rem", height: "2rem" }} /> Sign up with Google
              </button>

              <p className="mt-4 text-center" style={{ fontSize: "0.9rem", userSelect: "none" }}>Already have an account? <Link to="/login" className="text-primary text-decoration-none">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
