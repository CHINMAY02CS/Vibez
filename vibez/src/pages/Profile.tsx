import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Heart, Trash, Smile, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Post } from "@/Interfaces";
import { CommentDetails, initialProfileDetails, ProfileDetails } from "@/interfaces/Profile";

export default function Profile() {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>(initialProfileDetails);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [openProfilePicDialog, setOpenProfilePicDialog] = useState(false);
  const user = localStorage.getItem("user");
  const [fetch, setFetch] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (user) {
          const response = await axios.get(`http://localhost:5000/user/${JSON.parse(user)?._id}`);
          setProfileDetails(response.data?.user);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserPosts();
  }, [fetch]);
  useEffect(() => {
    axios
      .get(
        "http://localhost:5000/get-my-posts",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "application/json",
          },
        },
      )
      .then((res) => {
        setMyPosts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  async function likePost(id: string) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Authorization token not found!");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/like",
        { postId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedPost = response.data;

      const newData = myPosts.map((post: Post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setMyPosts(newData);

      if (openPost?._id === id) {
        setOpenPost(updatedPost);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  async function unlikePost(id: string) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Authorization token not found!");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/unlike",
        { postId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedPost = response.data;

      const newData = myPosts.map((post: Post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setMyPosts(newData);

      if (openPost?._id === id) {
        setOpenPost(updatedPost);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  async function addComment(text: string, id: string) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Authorization token not found!");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/comment",
        {
          text: text,
          postId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedPost = response.data;

      const newData = myPosts.map((post: Post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setMyPosts(newData);

      if (openPost?._id === id) {
        setOpenPost(updatedPost);
      }

      setComments((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  const [openPost, setOpenPost] = useState<Post>();

  const setPostInDialog = async (id: string) => {
    try {
      const post = myPosts.find((p: Post) => p._id === id);
      if (post) {
        setOpenPost(post);

        setAlertOpen(true);
      } else {
        console.error("Post not found!");
      }
    } catch (error) {
      console.error(error, "Please try again");
    }
  };

  const userName = JSON.parse(localStorage.getItem("user") ?? "").name;

  return (
    <>
      <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:w-1/2 lg:max-w-128 lg:mx-auto lg:gap-x-8">
        <img
          src={profileDetails.Photo ? profileDetails.Photo : `https://avatars.githubusercontent.com/u/98474924?v=4`}
          alt="profile pic"
          className="w-40 h-40 rounded-full cursor-pointer"
          onClick={() => setOpenProfilePicDialog(true)}
        />
        <div className="mt-2">
          <p className="text-3xl font-bold text-center lg:text-left">{userName}</p>
          <div className="flex items-center w-full mt-4 gap-x-4">
            <p className="text-lg font-semibold">{myPosts.length} posts</p>
            <p className="text-lg font-semibold">{profileDetails?.followers?.length || 0} followers</p>
            <p className="text-lg font-semibold">{profileDetails?.following?.length || 0} following</p>
          </div>
        </div>
      </div>
      <div className="grid items-center justify-center grid-cols-2 gap-4 px-6 pt-4 mx-auto mt-16 border-t-2 md:max-w-max lg:grid-cols-4 lg:min-w-160">
        {myPosts.length > 0 &&
          myPosts.map((post: Post, index) => {
            return (
              <div key={index}>
                <img
                  src={post?.photo}
                  alt=""
                  className="max-w-40 max-h-40"
                  id={String(index)}
                  onClick={() => setPostInDialog(post._id)}
                />
              </div>
            );
          })}
      </div>
      {openPost && (
        <PostDetails
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          post={openPost}
          myPosts={myPosts}
          setMyPosts={setMyPosts}
          likePost={likePost}
          addComment={addComment}
          comments={comments}
          unlikePost={unlikePost}
          setComments={setComments}
        />
      )}
      <ProfilePicDialog
        openProfilePicDialog={openProfilePicDialog}
        setOpenProfilePicDialog={setOpenProfilePicDialog}
        setFetch={setFetch}
        profileDetails={profileDetails}
      />
    </>
  );
}

const PostDetails = ({
  alertOpen,
  setAlertOpen,
  post,
  likePost,
  myPosts,
  setMyPosts,
  addComment,
  comments,
  setComments,
  unlikePost,
}: {
  alertOpen: boolean;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
  post: Post;
  comments: any;
  setComments: any;
  likePost: (id: string) => void;
  unlikePost: (id: string) => void;
  addComment: (text: string, id: string) => void;
  myPosts: Post[];
  setMyPosts: Dispatch<SetStateAction<Post[]>>;
}) => {
  async function deletePost(postId: string) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Authorization token not found!");
        return;
      }

      const response = await axios.delete(`http://localhost:5000/delete-post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedPost = response.data;

      const newData = myPosts.map((post: Post) => {
        if (post._id === updatedPost.data._id) {
          return updatedPost;
        }
        return post;
      });

      setMyPosts(newData);
      setAlertOpen(false);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }
  const userId = JSON.parse(localStorage.getItem("user") ?? "")._id;

  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen} key={post._id}>
      <AlertDialogContent className="px-3 py-0 rounded-lg max-h-176 lg:max-w-240 lg:max-h-none">
        <div className="flex items-end justify-end">
          <AlertDialogCancel className="p-0 m-0 border-none shadow-none max-w-max">
            <X className="w-4 h-4" />{" "}
          </AlertDialogCancel>
        </div>
        <div className="grid items-start lg:grid-cols-2 gap-x-4">
          <img className="h-80 w-120" src={post?.photo} />
          {/* right card */}
          <div>
            <div className="flex items-center justify-between p-2 mt-2 border border-gray-200 rounded-sm lg:mt-0">
              <div className="flex items-center gap-x-4">
                <img
                  src={"https://avatars.githubusercontent.com/u/98474924?v=4"}
                  alt=""
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
                <p className="cursor-pointer">{post?.postedBy?.name}</p>
              </div>
              <Trash onClick={() => deletePost(post._id)} />
            </div>
            {post?.comments?.length > 0 && (
              <div className="pb-2 mt-2 overflow-y-auto border border-gray-100 max-h-52 lg:max-h-76">
                {post.comments.map((comment: CommentDetails, index: number) => {
                  return (
                    <div className="flex items-center p-2 gap-x-4" id={String(index)} key={index}>
                      <img src={""} alt="" className="w-8 h-8 rounded-full cursor-pointer" />
                      <div>
                        <p className="text-sm font-bold cursor-pointer">{comment?.postedBy?.name}</p>
                        <p className="text-xs cursor-pointer">{comment.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex items-center w-full p-3 px-1 gap-x-4">
              <div className="flex items-center gap-x-1">
                {post?.likes?.includes(userId) ? (
                  <Heart
                    className="w-6 h-6 font-normal text-red-600 cursor-pointer fill-red-600"
                    onClick={() => unlikePost(post._id)}
                  />
                ) : (
                  <Heart className="w-6 h-6 font-normal cursor-pointer" onClick={() => likePost(post._id)} />
                )}
                <p className="mt-1.5 text-xs">{post?.likes ? post.likes.length : "0"}</p>
              </div>
              <div className="flex items-center w-full">
                <Smile className="w-4 h-4 mr-2 cursor-pointer" />
                <div className="flex items-center w-full space-x-2">
                  <Input
                    type="text"
                    placeholder="Add your comment . . ."
                    value={comments[post._id] || ""}
                    className="h-8 border shadow-none placeholder:text-xs"
                    onChange={(e) =>
                      setComments((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                  />
                  <Button type="submit" onClick={() => addComment(comments[post._id], post._id)} className="h-8">
                    Add
                  </Button>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
        <AlertDialogFooter></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import { AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const ProfilePicDialog = ({
  openProfilePicDialog,
  setOpenProfilePicDialog,
  setFetch,
  profileDetails,
}: {
  openProfilePicDialog: boolean;
  setOpenProfilePicDialog: Dispatch<SetStateAction<boolean>>;
  setFetch: Dispatch<SetStateAction<boolean>>;
  profileDetails: any;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | any>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [saveProfilePic, setSaveProfilePic] = useState(false);
  const [uploadPic, setUploadPic] = useState(false);
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
      setSelectedImage(file);
      setSaveProfilePic(true);
    }
  }

  function sendImageOnCloudinary() {
    const data = new FormData();
    data.append("file", selectedImage);
    data.append("upload_preset", "vibez-app");
    data.append("clound_name", "chinmaycloud ");
    fetch("https://api.cloudinary.com/v1_1/chinmaycloud/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setImageUrl(data.url))
      .catch((err) => console.log(err));
  }

  function savePic() {
    axios
      .put(
        "http://localhost:5000/upload-profile-pic",
        JSON.stringify({
          pic: imageUrl,
        }),
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "application/json",
          },
        },
      )
      .then((data) => {
        console.log(data.data);
        setOpenProfilePicDialog(false);
        setSelectedImage(null);
        setPhoto(null);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setFetch((prev) => !prev);
      });
  }

  function removePic() {
    axios
      .put(
        "http://localhost:5000/upload-profile-pic",
        JSON.stringify({
          pic: null,
        }),
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "application/json",
          },
        },
      )
      .then((data) => {
        console.log(data);
        setOpenProfilePicDialog(false);
        setSelectedImage(null);
        setPhoto(null);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setFetch((prev) => !prev);
      });
  }

  useEffect(() => {
    if (selectedImage && uploadPic) {
      sendImageOnCloudinary();
    }
  }, [selectedImage, uploadPic]);

  useEffect(() => {
    if (imageUrl && uploadPic) {
      savePic();
    }
  }, [imageUrl, uploadPic]);

  return (
    <AlertDialog open={openProfilePicDialog} onOpenChange={setOpenProfilePicDialog}>
      <AlertDialogTrigger asChild className="hidden"></AlertDialogTrigger>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Profile Pic</AlertDialogTitle>
        </AlertDialogHeader>
        <CardContent className="flex items-center justify-center p-0 m-0 h-100">
          {photo ? (
            <img className="object-contain w-auto h-full max-h-full pt-3" src={photo} alt="Selected preview" />
          ) : (
            <>
              {profileDetails.Photo ? (
                <img
                  className="object-contain w-auto h-full max-h-full pt-3"
                  src={profileDetails.Photo}
                  alt="Selected preview"
                />
              ) : (
                <p className="text-gray-500">Select the image you want to upload</p>
              )}
            </>
          )}
        </CardContent>
        {saveProfilePic ? (
          <>
            <Button onClick={() => setUploadPic(true)}>Save</Button>
          </>
        ) : (
          <>
            <Label
              htmlFor="fileInput"
              className="px-4 py-3 text-center text-white bg-blue-600 rounded cursor-pointer h-9 hover:bg-blue-600"
            >
              Add a New Profile Pic
            </Label>

            <Input type="file" name="image" id="fileInput" className="hidden" onChange={handleImageChange} />
          </>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setFetch((prev) => !prev);
              setPhoto(null);
              setSelectedImage(null);
              setSaveProfilePic(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button onClick={removePic}>Remove Profile Pic</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
