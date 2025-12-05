import React from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationData: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieAnimation = ({
  animationData,
  className = "",
  loop = true,
  autoplay = true,
}: LottieAnimationProps) => {
  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: "100%", height: "100%" }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
        }}
      />
    </div>
  );
};

export default LottieAnimation;