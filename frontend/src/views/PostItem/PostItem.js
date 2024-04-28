import React from "react";
import { NavBar } from "../../components/shared/NavBar/navbar";
import { ItemUpload } from "../../components/shared/ItemUpload/ItemUpload";
import "../../styles/Home.css";

function PostItem() {
  return (
    <div>
      <div>
        <NavBar /> {/*nav component */} 
      </div>
      <div>
        <ItemUpload /> {/* item upload component*/}
      </div>
    </div>
  );
}

export default PostItem;
