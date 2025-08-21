import { View, Text, Pressable, Image } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { usePlayerContext } from "@/components/playerContext";
import { getCardImage, classNames } from "@/internal/jsonloader";

const FlipCard = ({
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
}) => {
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
};

export default function HomeScreen() {
  // tailwindcss-class-safelist
  // text-blue-500 text-red-500 text-yellow-500

  const { cardClass, card } = usePlayerContext();

  const classColors = [
    "text-blue-500",
    "text-red-500",
    "text-red-500",
    "text-yellow-500",
  ];

  const isFlipped = useSharedValue(1);

  const [unveiled, setUnveiled] = useState(false);

  useEffect(() => {
    // Leader is always shown
    if (cardClass === 3) {
      isFlipped.value = withTiming(0, { duration: 0 });
      setUnveiled(true);
    } else {
      isFlipped.value = withTiming(1, { duration: 0 });
      setUnveiled(false);
    }
  }, [cardClass, isFlipped]);

  const handlePress = () => {
    isFlipped.value = withTiming(isFlipped.value === 0 ? 1 : 0, {
      duration: 500,
    });
    setUnveiled(!unveiled);
  };

  if (cardClass === -1 || card === -1) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex pt-10 pb-56 px-4 items-center flex-col w-full h-full bg-zinc-900 gap-2">
      <View className="w-full h-20 items-center justify-center bg-zinc-600/20 rounded-2xl">
        {unveiled ? (
          <Text className={"text-3xl font-extrabold " + classColors[cardClass]}>
            {classNames[cardClass]}{" "}
          </Text>
        ) : (
          <Text className="text-white text-3xl font-extrabold">
            Hidden Class{" "}
          </Text>
        )}
      </View>

      <FlipCard
        isFlipped={isFlipped}
        FrontSide={<FrontSide url={getCardImage(cardClass, card) || ""} />}
        BackSide={<BackSide />}
      />
      <View className="w-full h-14 items-center justify-center  flex flex-row gap-4">
        <Pressable
          className="w-20 h-12 bg-blue-600/15 items-center justify-center rounded-2xl border border-transparent active:bg-blue-600/30 active:border-blue-400 transition-colors duration-75 ease-in-out"
          onPress={handlePress}
        >
          <Text className="text-white">{!unveiled ? "Show" : "Hide"} </Text>
        </Pressable>
      </View>
    </View>
  );
}

function FrontSide({ url }: { url: string }) {
  return (
    <Image
      source={{ uri: url }}
      style={{ width: "100%", height: "100%", borderRadius: 16 }}
      resizeMode="contain"
      className="rounded-2xl"
    />
  );
}

function BackSide() {
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
