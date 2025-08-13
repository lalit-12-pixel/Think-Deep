import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errors, setErrors] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        navigate("/home");
      } else {
        if (passwordRef.current) passwordRef.current.value = "";
        setErrors(data.errors || [{ msg: "Login failed. Please try again." }]);
      }
    } catch (err) {
      setErrors([{ msg: "Something went wrong. Please try again." }]);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  return (
    <>
      <Helmet>
        <title>Log in to your Account</title>
      </Helmet>
      <form method="post" onSubmit={handleLogin}>
        <div
        className="onmobile"
          style={{
            width: "95%",
            maxWidth: "600px",
            margin: "80px auto 100px auto",
            padding: "2rem 1.7rem",
            borderRadius: "25px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            border: "1px solid #686767ff",
          }}
        >
          <h2
            style={{
              marginBottom: "24px",
              marginTop:"10px",
              textAlign: "center",
              fontWeight: "600",
              fontSize: "1.5rem",
            }}
          >
            Login to Your Account
          </h2>

          {errors.length > 0 && (
            <div
              style={{
                border: "1px solid #ff4d4d",
                color: "#cc0000",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {errors.map((err, index) => (
                  <li key={index}>{err.msg || err}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="email"
              style={{ fontWeight: "500", display: "block", marginBottom: "6px" ,marginLeft:"5px"}}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              ref={emailRef}
              placeholder="you@example.com"
              style={{
                padding: "12px",
                borderRadius: "10px",
                width: "100%",
                border: "1px solid #686767ff",
                fontSize: "1rem",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="password"
              style={{ fontWeight: "500", display: "block", marginBottom: "6px" , marginLeft:"5px"}}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              ref={passwordRef}
              placeholder="Your Password"
              style={{
                padding: "12px",
                borderRadius: "10px",
                width: "100%",
                border: "1px solid #686767ff",
                fontSize: "1rem",
              }}
              required
            />
          </div>

          <button
            className="btn btn-primary w-100"
            style={{
              padding: "12px",
              fontSize: "1.05rem",
              fontWeight: "600",
              borderRadius: "10px",
              backgroundColor: "#0d6efd",
              borderColor: "#0d6efd",
            }}
            type="submit"
          >
            Login
          </button>

          <div
            style={{
              textAlign: "center",
              margin: "0.6rem 0",
              fontWeight: "500",
              color: "#666",
            }}
          >
            or
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            style={{
              padding: "12px",
              width: "100%",
              fontWeight: "600",
              fontSize: "1rem",
              borderRadius: "10px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              color: "#444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <img
              src="/google.png"
              alt="Google logo"
              style={{ width: "24px", height: "24px" }}
            />
            Sign up with Google
          </button>

          <p
            style={{
              marginTop: "20px",
              fontSize: "0.95rem",
              textAlign: "center",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#0d6efd",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default Login;
