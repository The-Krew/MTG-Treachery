import { View } from "react-native";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <View className="w-screen h-screen max-h-screen flex py-10 px-4 items-center flex-col bg-zinc-900 gap-4">
      {children}
    </View>
  );
}
