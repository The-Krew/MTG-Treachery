import { View, Text } from "react-native";
import React from "react";
import { LoaderCircle } from "lucide-react-native";
import { Button } from "./ui/button";

export default function ServerConnect({ onRetry }: { onRetry: () => void }) {
  return (
    <>
      <View className="w-screen h-screen justify-center items-center bg-zinc-900 gap-10">
        <View className="animate-spin">
          <LoaderCircle size={64} color="white" />
        </View>
        <Text className="text-white font-extrabold text-2xl">
          Waiting for server connection.
        </Text>
        <Button color="active" size="sm" onPress={onRetry}>
          <Text className="text-white font-bold text-md">Retry</Text>
        </Button>
      </View>
    </>
  );
}
