import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface PublicLayoutProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function PublicLayout({ title, className, children }: PublicLayoutProps) {
  return (
    <>
      <Card className="flex flex-col justify-end w-full h-screen p-8 m-0 border-none rounded-none lg:p-16 lg:flex-row bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600">
        <Card className="flex flex-col w-full py-4 my-auto border-none rounded-lg shadow-xl lg:h-full lg:p-16 lg:flex-row bg-opacity-30 backdrop-blur-md bg-white/30 lg:w-1/2">
          <CardHeader className="w-full p-0 m-0 text-2xl text-center">
            <CardTitle className="mb-4">{title}</CardTitle>
            <CardContent className={`p-0 px-4 m-0 ${className}`}>{children}</CardContent>
          </CardHeader>
        </Card>
      </Card>
    </>
  );
}
