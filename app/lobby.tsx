import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { Plus, BetweenHorizontalStart, Play } from "lucide-react-native";

export default function LobbyScreen() {
  const router = useRouter();

  // Placeholder for code generation
  function generateCode() {
    // This function would generate a unique code for the lobby
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const code = generateCode();
  const clientId = generateCode(); // Simulating a client ID generation

  // Start game handling
  function onStartGame() {
    router.push("/");
  }

  return (
    <View className="flex-1 pt-10 px-4 items-center bg-zinc-900 h-screen pb-12">
      <View className="w-full h-20 items-center justify-center bg-zinc-600/20 rounded-2xl mb-4">
        <Text className="text-white text-3xl font-bold"> Lobby managment </Text>
      </View>
      <View className="mt-4 h-full flex-1 items-center justify-center">
        <View className="bg-zinc-400/20 p-4 rounded-lg shadow-md">
          <QRCode
            value={code}
            size={100}
            color="white"
            backgroundColor="transparent"
          />
        </View>
        <Text className="mt-4 text-white text-lg">
          Code: <Text className="font-bold"> {code}</Text>
        </Text>

        <View className="w-screen h-96  mt-8 px-6">
          <View className="w-full h-full " style={{ rowGap: 10, columnGap: 5 }}>
            <View className="flex-row items-center justify-between p-4 bg-zinc-500/20 rounded-lg">
              <Text className="text-white text-lg font-bold">Your user</Text>
              <Text className="text-white text-lg ml-2">{clientId}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="w-full h-28 items-center justify-center bg-zinc-600/10 rounded-2xl mt-4 flex flex-row gap-14">
        <View>
          <Pressable
            className="w-16 h-16 bg-blue-600/20 items-center justify-center rounded-full border border-transparent active:bg-blue-600/30 active:border-blue-400 transition-colors duration-75 ease-in-out"
            onPress={() => {
              console.log("Create Lobby Pressed");
            }}
          >
            <Plus size={40} color="white" />
          </Pressable>
          <Text className="text-gray-300 text-sm text-center mt-1">Create</Text>
        </View>
        <View>
          <Pressable
            className="w-16 h-16 bg-blue-600/20 items-center justify-center rounded-full border border-transparent active:bg-blue-600/30 active:border-blue-400 transition-colors duration-75 ease-in-out"
            onPress={() => {
              console.log("Join Lobby Pressed");
            }}
          >
            <BetweenHorizontalStart size={40} color="white" />
          </Pressable>
          <Text className="text-gray-300 text-sm text-center mt-1">Join</Text>
        </View>
        <View>
          <Pressable
            className="w-16 h-16 bg-blue-600/20 items-center justify-center rounded-full border border-transparent active:bg-blue-600/30 active:border-blue-400 transition-colors duration-75 ease-in-out"
            onPress={onStartGame}
          >
            <Play size={40} color="white" />
          </Pressable>
          <Text className="text-gray-300 text-sm text-center mt-1">Start</Text>
        </View>
      </View>
    </View>
  );
}
