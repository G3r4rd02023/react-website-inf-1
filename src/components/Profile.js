import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img
          src={user.picture}
          alt={user.name}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
        <h2 style={{ fontSize: "12px" ,color: "white" }}>{user.name}</h2>       
      </div>
    )
  );
};
