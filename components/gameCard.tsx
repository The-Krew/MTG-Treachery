import { Image, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

export function FlipCard({
  isFlipped,
  direction = "y",
  FrontSide,
  BackSide,
}: {
  isFlipped: any;
  direction?: "x" | "y";
  duration?: number;
  FrontSide: React.ReactNode;
  BackSide: React.ReactNode;
}) {
  const isDirectionX = direction === "x";

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(isFlipped.value, [0, 1], [0, 180]);
    return {
      transform: [
        { perspective: 1000 },
        isDirectionX ? { rotateX: `${spin}deg` } : { rotateY: `${spin}deg` },
      ],
      opacity: spin <= 90 ? 1 : 0, // Hide when facing away
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(isFlipped.value, [0, 1], [180, 360]);
    return {
      transform: [
        { perspective: 1000 },
        isDirectionX ? { rotateX: `${spin}deg` } : { rotateY: `${spin}deg` },
      ],
      opacity: spin >= 270 ? 1 : 0, // Hide when facing away
    };
  });

  return (
    <View className="w-full h-full ">
      <Animated.View className="absolute inset-0" style={[frontAnimatedStyle]}>
        {FrontSide}
      </Animated.View>
      <Animated.View className="absolute inset-0" style={[backAnimatedStyle]}>
        {BackSide}
      </Animated.View>
    </View>
  );
}

export function FrontSide({ url }: { url: string }) {
  return (
    <Image
      source={{ uri: url }}
      style={{ width: "100%", height: "100%", borderRadius: 16 }}
      resizeMode="contain"
      className="rounded-2xl"
    />
  );
}

export function BackSide() {
  return (
    <Image
      source={require("@/images/card-backside.png")}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 16,
      }}
      resizeMode="contain"
      className="rounded-2xl"
    />
  );
}
