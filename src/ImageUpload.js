import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import firebases from "firebase";
import firebase from "./firebase";

import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [load, setLoad] = useState(0);

  const onImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onUpload = () => {
    const upload = firebase.storage.ref(`images/${image.name}`).put(image); // Thực hiện cv tải
    upload.on(
      "state_changed",
      (snapshot) => {
        const load = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setLoad(load);
      },
      (err) => {
        console.log(err);
        alert(err.message);
      },
      () => {
        firebase.storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            firebase.db.collection("posts").add({
              timestamp: firebases.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setLoad(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageUpload">
      <progress
        className="imageUpload__progress"
        value={load}
        max="100"
      ></progress>
      <Input
        type="text"
        placeholder="Cập nhật trạng thái"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Input type="file" onChange={onImage} />
      <Button onClick={onUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
