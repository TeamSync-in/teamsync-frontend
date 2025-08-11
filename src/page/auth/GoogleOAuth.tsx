import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/store/store";
import { Loader2 } from "lucide-react";

const GoogleOAuth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setAccessToken } = useStore();

  const status = params.get("status");
  const accessToken = params.get("access_token");
  const currentWorkspace = params.get("current_workspace");

  React.useEffect(() => {
    if (status === "success" && accessToken) {
      setAccessToken(accessToken);

      // Use setTimeout to prevent immediate re-render
      const timer = setTimeout(() => {
        if (currentWorkspace) {
          navigate(`/workspace/${currentWorkspace}`, { replace: true });
        } else {
          navigate(`/`, { replace: true });
        }
      }, 500);

      return () => clearTimeout(timer);
    } else if (status === "failure") {
      // Handle failure case without infinite loop
      console.log("Google auth failed");
    }
  }, [status, accessToken, currentWorkspace, navigate, setAccessToken]);

  // Show loading while processing
  if (status === "success" && accessToken) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <Logo />
            Team Sync.
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h1 className="text-xl font-semibold mb-2">Signing you in...</h1>
              <p className="text-muted-foreground">
                Please wait while we complete your authentication.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error for failed authentication
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          Team Sync.
        </Link>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2 text-destructive">
              Authentication Failed
            </h1>
            <p className="text-muted-foreground mb-4">
              We couldn't sign you in with Google. Please try again.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuth;
