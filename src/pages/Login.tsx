import { SignIn } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">登录</CardTitle>
          <CardDescription>
            欢迎回来！请使用您的账号登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignIn 
            routing="path"
            path="/login"
            signUpUrl="/register"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;