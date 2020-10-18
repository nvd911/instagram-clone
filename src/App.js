import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InstagramEmbed from "react-instagram-embed";

import "./App.css";
import ImageUpload from "./ImageUpload";
import Post from "./Post";
import firebase from "./firebase";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  image: {
    width: "30%",
    objectFit: "contain",
    marginLeft: "35%",
  },
}));

function App(props) {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogIn, setOpenLogin] = useState(false);
  const [user, setUser] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  async function signUp() {
    try {
      await firebase.register(name, email, password);
    } catch (err) {
      alert("Vui lòng nhập đầy đủ thông tin");
    }
  }

  async function signIn() {
    try {
      await firebase.login(email, password);
    } catch (err) {
      alert("Email hoặc password không đúng");
    }
  }

  useEffect(() => {
    firebase.db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })))
      );
  }, []);

  useEffect(() => {
    firebase.onAuth().then((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, [user]);

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form
            action=""
            className="app__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <center className="app__signIn">
              <img
                className={classes.image}
                src="https://sa.tinhte.vn/2013/05/3368533_Screen-Shot-2013-05-02-at-2.27.45-PM-730x300.png"
                alt=""
              />
              <Input
                placeholder="Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Input>
              <Input
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Input
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </center>
          </form>
        </div>
      </Modal>

      <Modal open={openLogIn} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form
            action=""
            className="app__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <center className="app__signIn">
              <img
                className={classes.image}
                src="https://sa.tinhte.vn/2013/05/3368533_Screen-Shot-2013-05-02-at-2.27.45-PM-730x300.png"
                alt=""
              />

              <Input
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Input
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </center>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://sa.tinhte.vn/2013/05/3368533_Screen-Shot-2013-05-02-at-2.27.45-PM-730x300.png"
          alt=""
        />

        {user ? (
          <Button onClick={() => firebase.logout()}>LogOut</Button>
        ) : (
          <div>
            <Button onClick={() => setOpenLogin(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName}></ImageUpload>
      ) : (
        <h3>Xin lỗi bạn phải login mới được tải ảnh</h3>
      )}

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => {
            return (
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              ></Post>
            );
          })}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
