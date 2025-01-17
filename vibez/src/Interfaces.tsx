export interface User {
  _id: string;
  name: string;
}

export interface Post {
  _id: string;
  body: string;
  photo: string;
  postedBy: User;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  comments: [];
}
