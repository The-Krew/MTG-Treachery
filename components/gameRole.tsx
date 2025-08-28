import React from "react";
import { Image, Text, View } from "react-native";
import { getRoleInfo, roles } from "@/internal/jsonloader";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { CircleQuestionMark } from "lucide-react-native";

export default function GameRole({
  unveiled,
  role,
}: {
  unveiled: boolean;
  role: number;
}) {
  const classColors = [
    "text-blue-500",
    "text-red-500",
    "text-red-500",
    "text-yellow-500",
  ];

  const hiddenOpacity = useSharedValue(unveiled ? 0 : 1);
  const revealedOpacity = useSharedValue(unveiled ? 1 : 0);

  const duration = 400;

  const url = getRoleInfo(role)?.img_src || "";

  const hiddenStyle = useAnimatedStyle(() => ({
    opacity: hiddenOpacity.value,
    transform: [{ scale: 1 }],
  }));

  const revealedStyle = useAnimatedStyle(() => ({
    opacity: revealedOpacity.value,
    transform: [{ scale: 1 }],
  }));

  React.useEffect(() => {
    if (role === -1) return;
    if (role === 3) {
      // Leader is always shown
      hiddenOpacity.value = 0;
      revealedOpacity.value = 1;
      return;
    }

    if (unveiled) {
      hiddenOpacity.value = withTiming(0, { duration: duration });
      revealedOpacity.value = withTiming(1, { duration: duration });
    } else {
      hiddenOpacity.value = withTiming(1, { duration: duration });
      revealedOpacity.value = withTiming(0, { duration: duration });
    }
    console.log("Role unveiled:", unveiled);
  }, [unveiled, hiddenOpacity, revealedOpacity]);

  return (
    <>
      <View className="w-full h-20 items-center justify-center bg-zinc-600/20 rounded-2xl">
        <View className="w-full h-6 absolute top-0  left-10 ">
          <View className="w-20 h-20 rounded-full bg-transparent justify-center items-center">
            <Animated.View style={[hiddenStyle, { position: "absolute" }]}>
              <CircleQuestionMark size={60} color="#7D7D7D" />
            </Animated.View>
            <Animated.View style={[revealedStyle, { position: "absolute" }]}>
              <Image source={{ uri: url }} className="w-16 h-16 rounded-full" />
            </Animated.View>
          </View>
        </View>

        <Animated.View style={[revealedStyle]}>
          <Text className={"text-3xl font-extrabold " + classColors[role]}>
            {roles[role]}
          </Text>
        </Animated.View>
        <Animated.View style={[hiddenStyle, { position: "absolute" }]}>
          <Text className="text-3xl font-extrabold text-stone-300">???</Text>
        </Animated.View>
      </View>
    </>
  );
}
