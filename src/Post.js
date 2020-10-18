import React, { useState, useEffect } from "react";
import { Avatar, Input, Button } from "@material-ui/core";

import "./Post.css";
import firebases from "firebase";
import firebase from "./firebase";

function Post({ username, user, caption, imageUrl, postId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  useEffect(() => {
    let clear;
    if (postId) {
      clear = firebase.db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => clear();
  }, [postId]);

  const onComment = (e) => {
    e.preventDefault();
    firebase.db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebases.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        ></Avatar>
        <h3>{username}</h3>
      </div>
      <img className="post__image" src={imageUrl} alt="" />
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment, index) => (
          <p key={index}>
            <strong>{comment.username}: </strong>
            {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form action="" className="post__commentBox">
          <Input
            className="post__input"
            type="text"
            placeholder="Thêm bình luận"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></Input>
          <Button
            className="post__button"
            type="submit"
            disabled={!comment}
            onClick={onComment}
          >
            Đăng
          </Button>
        </form>
      )}
    </div>
  );
}

export default Post;
