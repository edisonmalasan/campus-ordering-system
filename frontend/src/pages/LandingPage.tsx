import React from "react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to NaviBites Testing Phase
      </h1>
      <Button className="bg-primary text-primary-foreground">Click me</Button>
    </div>
  );
}
