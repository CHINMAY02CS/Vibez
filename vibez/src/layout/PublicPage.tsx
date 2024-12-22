import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface PublicLayoutProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function PublicLayout({ title, className, children }: PublicLayoutProps) {
  const bgClass = "bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600";
  return (
    <>
      <Card className={`flex items-end justify-end w-full h-screen p-8 border-none rounded-none lg:p-16 ${bgClass}`}>
        <Card className="p-4 m-auto border-none shadow-xl lg:mx-0 bg-opacity-30 backdrop-blur-md bg-white/30 w-96 md:w-1/2">
          <CardHeader className="w-full p-0 m-0 text-2xl text-center">
            <CardTitle className="mb-4">{title}</CardTitle>
          </CardHeader>
          <CardContent className={`m-0 pb-0 ${className}`}>{children}</CardContent>
        </Card>
      </Card>
    </>
  );
}
