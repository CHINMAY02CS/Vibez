import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Heart, Smile } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost:5000/get-all-posts",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "application/json",
          },
        },
      )
      .then((res) => {
        console.log(res);
        setAllPosts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      {allPosts.length > 0 &&
        allPosts.map((post, index) => {
          return (
            <Card className="md:w-120" key={index}>
              <CardHeader className="p-4 border-b">
                <CardTitle className="flex items-center gap-x-4">
                  <img
                    src={"https://avatars.githubusercontent.com/u/98474924?v=4"}
                    alt=""
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                  <p className="cursor-pointer">{post?.postedBy?.name}</p>
                </CardTitle>
                {/* <CardDescription>Later add location here</CardDescription> */}
              </CardHeader>
              <CardContent className="p-0 m-0 h-80">
                <img className="h-80 w-120" src={post?.photo} />
              </CardContent>
              <CardFooter className="flex-col items-start p-4 gap-y-2">
                <div className="flex gap-x-2">
                  <Heart className="w-6 h-6 font-normal cursor-pointer" />
                </div>
                <p className="text-sm">1 Like</p>
                {post?.body}
              </CardFooter>
              <div className="flex items-center w-full p-4 pt-0">
                <Smile className="w-6 h-6 mr-2 cursor-pointer" />
                <div className="flex items-center w-full space-x-2">
                  <Input type="email" placeholder="Add your comment . . ." className="border shadow-none" />
                  <Button type="submit" className="">
                    Comment
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
    </div>
  );
}
