import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/auth/login-form";

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Log in to your
account</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}