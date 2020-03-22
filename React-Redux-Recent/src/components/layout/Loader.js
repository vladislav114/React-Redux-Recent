import React from "react";
import loader from "../../loading.gif";

const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
};

export default function Loader() {
  return (
    <div style={styles}>
      <img src={loader} alt="loading" width="100" />
    </div>
  );
}
