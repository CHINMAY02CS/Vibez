import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, Smile } from "lucide-react";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <Card className="md:w-120">
        <CardHeader className="p-4 border-b">
          <CardTitle className="flex items-center gap-x-4">
            <img
              src="https://avatars.githubusercontent.com/u/98474924?v=4"
              alt=""
              className="w-8 h-8 rounded-full cursor-pointer"
            />
            <p className="cursor-pointer">Person Name</p>
          </CardTitle>
          {/* <CardDescription>Later add location here</CardDescription> */}
        </CardHeader>
        <CardContent className="p-0 m-0 h-80">
          <img
            className="h-80 w-120"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkJuhs3xtJ0V94n2PYF04yJ7JqFJ3Co7odWQ&s"
          />
        </CardContent>
        <CardFooter className="flex-col items-start p-4 gap-y-2">
          <div className="flex gap-x-2">
            <Heart className="w-6 h-6 font-normal cursor-pointer" />
          </div>
          <p className="text-sm">1 Like</p>
          This is amazing
        </CardFooter>
        <div className="flex items-center w-full p-4 pt-0">
          <Smile className="w-6 h-6 mr-2 cursor-pointer" />
          <div className="flex items-center w-full space-x-2">
            <Input type="email" placeholder="Add your comment . . ." className="border shadow-none" />
            <Button type="submit" className="">
              Post
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
