import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

export default class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Keep a console signal for debugging in deployed environments
    console.error("[AppErrorBoundary] Uncaught error", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-slate-900">页面加载失败</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">
                应用运行时发生错误。请打开浏览器控制台查看详细信息。
              </p>
              <pre className="text-xs whitespace-pre-wrap rounded-xl bg-slate-900 text-slate-50 p-4 overflow-auto max-h-64">
                {this.state.error.message}
              </pre>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
