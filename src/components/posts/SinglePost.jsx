import React, { useState } from "react";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase/Setup";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "./SinglePost.scss";
import { PermMediaOutlined } from "@mui/icons-material";
import { Button } from "react-bootstrap";

const SinglePost = ({ onNewPost }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [postText, setPostText] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      let downloadURL = "";

      // If a file is selected, upload it to storage
      if (file) {
        setLoading(true);

        const name = new Date().getTime() + file.name;
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        const uploadSnapshot = await uploadTask;
        downloadURL = await getDownloadURL(uploadSnapshot.ref);

        setLoading(false);
      }

      // Add post data to Firestore
      const postDocRef = await addDoc(collection(db, "posts"), {
        postOwner: user.displayName,
        userPhoto: user.photoURL,
        postText,
        imageUrl: downloadURL,
        userId: user.uid,
        likes: 0,
        comments: [],
        timeStamp: serverTimestamp(),
      });

      // Notify the parent component about the new post
      onNewPost({
        id: postDocRef.id,
        postOwner: user.displayName,
        userPhoto: user.photoURL,
        postText,
        imageUrl: downloadURL,
        userId: user.uid,
        likes: 0,
        comments: [],
        timeStamp: serverTimestamp(),
      });

      toast.success("Posted Successfully");
      setPostText("");
    } catch (error) {
      setLoading(false);
      toast.error("Something Went Wrong !");
    }
  };

  return (
    <div className="single-post">
      <div className="post-profile">
        <img src={user.photoURL} className="load" alt="" />
      </div>

      <form className="post-form" onSubmit={handleAdd}>
        <textarea
          type="text"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Write Something..."
          required={!file}
        />

        <div className="post-input">
          <label htmlFor="file" className="file-lable">
            <PermMediaOutlined />
          </label>

          <input
            type="file"
            id="file"
            className="custom-file-input"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button type="submit" className="post-btn" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SinglePost;
