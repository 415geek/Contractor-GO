import { SignUp } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl border-slate-200/70 shadow-[0_12px_35px_-20px_rgba(15,23,42,0.35)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">注册</CardTitle>
          <CardDescription>创建账号后会自动进入系统</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUp
            routing="path"
            path="/register"
            signInUrl="/login"
            afterSignUpUrl="/dashboard"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
