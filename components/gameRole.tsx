import React from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { CircleQuestionMark } from "lucide-react-native";
import Header from "./ui/header";
import { usePlayerContext } from "./playerContext";

export default function GameRole() {
  const classColors = [
    "text-blue-500",
    "text-red-500",
    "text-yellow-500",
    "text-red-500",
  ];

  const { card, unveiled } = usePlayerContext();

  const hiddenOpacity = useSharedValue(unveiled ? 0 : 1);
  const revealedOpacity = useSharedValue(unveiled ? 1 : 0);

  const duration = 400;

  const hiddenStyle = useAnimatedStyle(() => ({
    opacity: hiddenOpacity.value,
    transform: [{ scale: 1 }],
  }));

  const revealedStyle = useAnimatedStyle(() => ({
    opacity: revealedOpacity.value,
    transform: [{ scale: 1 }],
  }));

  React.useEffect(() => {
    if (card.rolename === "") return;
    if (card.rolename === "Leader") {
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
  }, [unveiled, hiddenOpacity, revealedOpacity, card]);

  return (
    <Header bg="light">
      <View className="w-full h-full absolute top-0  left-10 ">
        <View className="w-24 h-24 rounded-full bg-transparent justify-center items-center">
          <Animated.View style={[hiddenStyle, { position: "absolute" }]}>
            <CircleQuestionMark size={60} color="#7D7D7D" />
          </Animated.View>
          <Animated.View style={[revealedStyle, { position: "absolute" }]}>
            <Image
              source={{ uri: card.role_url }}
              className="w-16 h-16 rounded-full"
            />
          </Animated.View>
        </View>
      </View>

      <Animated.View style={[revealedStyle]}>
        <Text
          className={"text-3xl font-extrabold " + classColors[card.roleid - 1]}
        >
          {card.rolename}
        </Text>
      </Animated.View>
      <Animated.View style={[hiddenStyle, { position: "absolute" }]}>
        <Text className="text-3xl font-extrabold text-stone-300">???</Text>
      </Animated.View>
    </Header>
  );
}
