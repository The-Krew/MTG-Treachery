import { SafeAreaView, View } from "react-native";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View className="h-full w-full py-10 px-4 bg-zinc-950 flex-col items-center justify-evenly gap-4">
        {children}
      </View>
    </SafeAreaView>
  );
}
