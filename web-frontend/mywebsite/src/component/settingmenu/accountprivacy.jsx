import React, { useState } from "react";

const AccountPrivacy = () => {
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <>
      <h4
        style={{
          marginBottom: "30px",
          marginLeft: "5px",
          fontWeight: "600",
        }}
      >
        Account Privacy
      </h4>

      <div
        className="mb-4 d-flex align-items-center justify-content-between"
        style={{
          border: "0.5px solid #343030ff",
          width: "100%",
          height: "70px",
          borderRadius: "10px",
        }}
      >
        <label
          className="form-label  mb-0 me-3"
          htmlFor="privateAccountToggle"
          style={{
            whiteSpace: "nowrap",
            marginLeft: "20px",
            fontWeight: "400",
          }}
        >
          Private account
        </label>
        <div className="form-check form-switch m-0">
          <input
            className="form-check-input"
            type="checkbox"
            id="privateAccountToggle"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
            style={{
              backgroundColor: window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "#0c50ceff"
                : "#929090e5",
              border: "0.5px solid #343030ff",
              width:"40px",
              height:"20px",
              marginRight:"30px"
            }}
          />

        </div>
      </div>

      <p
        style={{
          fontFamily: "inherit",
          color: "rgba(132, 128, 128, 1)",
          fontSize: "12px",
          lineHeight: "16px",
        }}
      >
        When your account is public, anyone — on or off the
        platform — can view your profile, posts, and replies, even if they don't
        follow you or have an account. Your tweets can appear in search results,
        hashtag feeds, and may be shared by others.
      </p>

      <p
        style={{
          fontFamily: "inherit",
          color: "rgba(132, 128, 128, 1)",
          fontSize: "12px",
          lineHeight: "16px",
         
        }}
      >
      When your account is private, only the people you
        approve as followers can see your tweets, replies, and
        follower/following lists. Your profile photo, display name, and username
        remain visible to everyone, but your posts and interactions are
        restricted to your followers.
        <a href="#" style={{ textDecoration:"none",}}>
         Learn more about account privacy.
         </a>
      </p>
    </>
  );
};

export default AccountPrivacy;
