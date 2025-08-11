import { AudioWaveform } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = (props: { url?: string; asChild?: boolean }) => {
  const { url = "/", asChild = false } = props;

  const logoElement = (
    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
      <AudioWaveform className="size-4" />
    </div>
  );

  return (
    <div className="flex items-center justify-center sm:justify-start">
      {asChild ? logoElement : <Link to={url}>{logoElement}</Link>}
    </div>
  );
};

export default Logo;
