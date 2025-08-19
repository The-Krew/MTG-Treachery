import { View, Text, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Play, LogOut } from "lucide-react-native";
import { generateCode, usePlayerContext } from "./internal/playerContext";
import { useEffect, useRef, useState } from "react";
import { cardClasses, getRandomCardIndex } from "./internal/jsonloader";

export default function LobbyScreen() {
  const idRef = useRef<string>(generateCode());
  const wsRef = useRef<WebSocket | null>(
    new WebSocket("wss://treachery.thekrew.app:3000/" + idRef.current),
  );

  const router = useRouter();

  const { setCard, setClass } = usePlayerContext();

  const [lobbyCode, setLobbyCode] = useState("");
  const [text, onChangeText] = useState("");

  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    wsRef.current = new WebSocket(
      "wss://treachery.thekrew.app:3000/" + idRef.current,
    );

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    wsRef.current.onmessage = (event) => {
      const message = event.data;
      console.log("Message from server:", message);
      // TODO: handle messages from serve
      // messages that can come from the server
      // "C/J/L-0" - Ok
      // "C/J/L/S/I-1" - Error
      //
      // "[creatorId, ...., pNid]"
      // "S-A/T/G/L" char of a class when game starts
      //
      if (message.startsWith("[")) {
        const data = JSON.parse(message);
        if (data.length > 0) {
          setPlayers(data);
        }
      }

      if (message.startsWith("C")) {
        const res = message.split("-")[1];

        if (res !== "0") {
          setLobbyCode("");
        }
      }

      if (message.startsWith("J")) {
        const res = message.split("-")[1];

        if (res !== "0") {
          setLobbyCode("");
        }
      }

      if (message.startsWith("L")) {
        const res = message.split("-")[1];

        if (res === "0") {
          setLobbyCode("");
          setPlayers([]);
        }
      }

      if (message.startsWith("S")) {
        const res = message.split("-")[1];
        if (res !== "1") {
          const classIndexing = ["G", "A", "T", "L"];

          const index = classIndexing.indexOf(res);

          setClass(index);
          setCard(getRandomCardIndex(cardClasses[index]));

          onStartGame();
        }
      }
    };

    if (lobbyCode) {
      wsRef.current.send("I " + lobbyCode);
    }

    return () => {
      wsRef.current?.close();
    };
  }, []);

  // Start game handling
  function onStartGame() {
    router.push("/");
  }

  function handleCreateLobby() {
    if (lobbyCode === "") {
      const code = generateCode();
      setLobbyCode(code); // <-- this updates the screen!
      wsRef.current?.send("C " + code);
    }
  }

  function handleJoinLobby() {
    if (text && lobbyCode === "") {
      setLobbyCode(text);
      wsRef.current?.send("J " + text); // assuming "J" is join command
      console.log("Join Lobby Pressed, code:", text);
      onChangeText(""); // Clear input after joining
    }
  }

  function handleLeaveLobby() {
    if (lobbyCode !== "") {
      wsRef.current?.send("L " + lobbyCode);
    }
  }

  function handleStartGame() {
    if (lobbyCode !== "") {
      wsRef.current?.send("S " + lobbyCode);
    }
  }

  return (
    <View className="flex-1 flex-col pt-10 px-4 items-center bg-zinc-900 h-screen pb-12">
      <View className="w-full h-20 items-center justify-center bg-zinc-600/20 rounded-2xl mb-4">
        <Text className="text-white text-3xl font-bold"> Lobby managment </Text>
      </View>
      <View className="w-full h-20 items-center justify-center bg-zinc-600/20 rounded-2xl ">
        <Text className="text-white text-2xl font-bold">
          Current lobby: {lobbyCode}{" "}
        </Text>
      </View>

      <View className="w-full h-40 mb-4  mt-4">
        <View className="h-1/2 flex-row items-center justify-center gap-2 bg-zinc-600/20 rounded-2xl ">
          <Text className="text-white text-2xl font-bold">Lobby code:</Text>
          <TextInput
            value={text}
            onChangeText={onChangeText}
            placeholder="XXXXXX"
            placeholderTextColor="#9CA3AF"
            className="text-white text-2xl font-bold text-center"
          />
        </View>
        <Pressable
          className="w-5/6 h-1/2 mx-auto flex-row items-center justify-center gap-2 bg-zinc-600/20 rounded-2xl mt-4"
          onPress={handleJoinLobby}
        >
          <Text className="text-white text-2xl font-bold">Join </Text>
        </Pressable>
      </View>
      <View className="mt-4 h-full flex-1 items-center justify-center">
        <View className="w-screen h-96  mt-8 px-6">
          <View className="w-full h-full " style={{ rowGap: 10, columnGap: 5 }}>
            {players.map((player, index) => {
              return (
                <View
                  className="flex-row items-center justify-between p-4 bg-zinc-500/20 rounded-lg"
                  key={index}
                >
                  <Text
                    className={
                      "text-lg font-bold " +
                      (player === idRef.current
                        ? "text-blue-400"
                        : "text-white")
                    }
                  >
                    Player {index + 1}:
                  </Text>
                  <Text className="text-white text-lg">{player} </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View className="w-full h-28 items-center justify-center bg-zinc-600/10 rounded-2xl mt-4 flex flex-row gap-14">
        <View>
          <Pressable
            className="w-16 h-16 bg-blue-600/20 items-center justify-center rounded-full border border-transparent active:bg-blue-600/30 active:border-blue-400 transition-colors duration-75 ease-in-out"
            onPress={handleCreateLobby}
          >
            <Plus size={40} color="white" />
          </Pressable>
          <Text className="text-gray-300 text-sm text-center mt-1">Create</Text>
        </View>
        <View>
          <Pressable
            className="w-16 h-16 bg-blue-600/20 items-center justify-center rounded-full border border-transparent active:bg-blue-600/30 active:border-blue-400 transition-colors duration-75 ease-in-out"
            onPress={handleLeaveLobby}
          >
            <LogOut size={40} color="white" />
          </Pressable>
          <Text className="text-gray-300 text-sm text-center mt-1">Leave</Text>
        </View>
        <View>
          <Pressable
            className="w-16 h-16 bg-blue-600/20 items-center justify-center rounded-full border border-transparent active:bg-blue-600/30 active:border-blue-400 transition-colors duration-75 ease-in-out"
            onPress={handleStartGame}
          >
            <Play size={40} color="white" />
          </Pressable>
          <Text className="text-gray-300 text-sm text-center mt-1">Start</Text>
        </View>
      </View>
    </View>
  );
}
