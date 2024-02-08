import React, { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/Setup";
import SinglePost from "../../components/posts/SinglePost";
import { Container, Dropdown, Modal } from "react-bootstrap";
import {
  Close,
  CommentOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  MoreVert,
  Send,
  Share,
} from "@mui/icons-material";

import "./UserProfile.scss";

const LoggedinUser = () => {
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postComment, setPostComment] = useState("");
  const [postComments, setPostComments] = useState({});
  const [show, setShow] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0); // State to hold total posts count

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const postsQuery = query(postsCollection, orderBy("timeStamp", "desc"));
        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Update total post count whenever posts state changes
    setTotalPosts(posts.filter((post) => post.userId === user.uid).length);
  }, [posts, user.uid]);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      toast.success("Post Deleted");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((post) => post.id === postId);

      if (post.likesBy && post.likesBy.includes(user.uid)) {
        await updateDoc(postRef, {
          likes: post.likes - 1,
          likesBy: post.likesBy.filter((uid) => uid !== user.uid),
        });
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likes: p.likes - 1,
                  likesBy: p.likesBy.filter((uid) => uid !== user.uid),
                }
              : p
          )
        );
      } else {
        await updateDoc(postRef, {
          likes: post.likes + 1,
          likesBy: [...(post.likesBy || []), user.uid],
        });
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likes: p.likes + 1,
                  likesBy: [...(p.likesBy || []), user.uid],
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleOpenModal = (postId) => {
    const post = posts.find((post) => post.id === postId);
    setPostComments({ ...postComments, [postId]: post.comments || [] });
    setCurrentPostId(postId);
    setShow(true);
  };

  const handlePostComment = async () => {
    try {
      const postRef = doc(db, "posts", currentPostId);
      const post = posts.find((post) => post.id === currentPostId);
      const updatedComments = [
        ...(postComments[currentPostId] || []),
        postComment,
      ];

      // Update both local state and Firestore
      await Promise.all([
        updateDoc(postRef, { comments: updatedComments }),
        updateDoc(postRef, { comments: updatedComments }), // Update the Firestore document
      ]);

      // Update local state
      setPostComments({
        ...postComments,
        [currentPostId]: updatedComments,
      });

      // Update the post in the posts state to reflect the new comment count
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === currentPostId ? { ...p, comments: updatedComments } : p
        )
      );

      setPostComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  const handleClose = () => {
    setShow(false);
    setCurrentPostId(null);
  };

  return (
    <Container fluid>
      <div className="user-profile">
        {loading ? (
          <div className="profile-top load"></div>
        ) : (
          <div className="profile-top">
            {user.photoURL && (
              <img src={user.photoURL} alt={`Profile of ${user.displayName}`} />
            )}

            <div className="pt-details">
              <h2>{user.displayName}</h2>
              <div className="pt-follow">
                <div className="followers">
                  5000 <span>Followers</span>
                </div>
                <div className="followers">
                  20 <span>Following</span>
                </div>
                <div className="followers">
                  {totalPosts}
                  <span>Posts</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <SinglePost onNewPost={handleNewPost} />

        {loading ? (
          <h3 className="pt-username load"></h3>
        ) : (
          <h3 className="pt-username">{user.displayName}'s Posts</h3>
        )}

        <div className="posts">
          {loading ? (
            <div className="single-post-content load"></div>
          ) : totalPosts <= 0 ? (
            <div className="single-post-content d-flex align-items-center justify-content-center">
              No posts available
            </div>
          ) : (
            posts
              .filter((post) => user.uid === post.userId)
              .map((post) => (
                <div key={post.id} className="single-post-content">
                  <div className="user-img">
                    <img src={post.userPhoto} className="img-fluid" alt="" />
                  </div>
                  <div className="post-details">
                    <div className="post-header">
                      <h1 className="post-owner">{post.postOwner} </h1>
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          <MoreVert />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {user.uid === post.userId ? (
                            <Dropdown.Item
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item>Follow</Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <p className="post-text">{post.postText}</p>
                    {post.imageUrl && (
                      <div className="post-img">
                        <img src={post.imageUrl} className="img-fluid" alt="" />
                      </div>
                    )}
                    <div className="interactions">
                      <div className="like-comment">
                        <div className="single-interaction">
                          <button
                            className="like-btn"
                            onClick={() => handleLikePost(post.id)}
                          >
                            {post.likesBy && post.likesBy.includes(user.uid) ? (
                              <FavoriteOutlined />
                            ) : (
                              <FavoriteBorderOutlined />
                            )}
                          </button>
                          <span className="count">{post.likes}</span>
                        </div>

                        <div className="single-interaction">
                          <button
                            className="comment-btn"
                            onClick={() => handleOpenModal(post.id)}
                          >
                            <CommentOutlined />
                          </button>
                          <span className="count">
                            {post.comments ? post.comments.length : 0}
                          </span>
                        </div>
                      </div>
                      <Share />
                    </div>
                  </div>
                </div>
              ))
          )}
          <Modal
            className="comment-modal modal-lg"
            fullscreen="md-down"
            show={show}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header>
              <Modal.Title>Comments</Modal.Title>

              <button
                className="post-close"
                type="button"
                onClick={handleClose}
              >
                <Close />
              </button>
            </Modal.Header>
            <Modal.Body>
              {postComments[currentPostId] &&
              postComments[currentPostId].length > 0 ? (
                <div className="all-comments">
                  {postComments[currentPostId].map((comment, index) => (
                    <div key={index} className="comment">
                      <p>{comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No comments</p>
              )}
            </Modal.Body>

            <Modal.Footer>
              <div className="comment-here">
                <textarea
                  placeholder="Write Comment..."
                  value={postComment}
                  onChange={(e) => setPostComment(e.target.value)}
                />

                <button onClick={handlePostComment}>
                  <Send />
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </Container>
  );
};

export default LoggedinUser;
