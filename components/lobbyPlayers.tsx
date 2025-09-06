import React from "react";
import { View, Text, ScrollView } from "react-native";
import { usePlayerContext } from "@/components/playerContext";
import { CircleQuestionMark, UsersRound } from "lucide-react-native";
import { Player } from "@/internal/types";

export default function LobbyPlayers() {
  // --------------------------------------------------------------------------------------
  // Context
  const { idRef, players } = usePlayerContext();
  console.log("Rendering LobbyPlayers with players:", players);
  return (
    <>
      <View className="w-full h-2/6  px-6 bg-zinc-600/20 rounded-2xl">
        <View className="w-full h-14 my-2">
          <View className="w-full h-full flex-row items-center px-5 gap-2">
            <UsersRound size={24} color="#7A578F" />
            <Text className="text-white text-xl font-bold">
              Players ({players.length}/8){" "}
            </Text>
          </View>
        </View>
        <ScrollView className="w-full h-full ">
          {players.map((player: Player, index: number) => {
            return (
              <View key={index} className="w-full h-16 my-2">
                <View
                  className=" w-full h-full flex-row items-center gap-3  px-4 py-1 bg-zinc-600/10 rounded-lg"
                  key={index}
                >
                  <View
                    className={
                      "h-14 w-14 bg-transparent rounded-full  justify-center items-center " +
                      (player.name === idRef?.current
                        ? "border-2 border-blue-400/60"
                        : "")
                    }
                  >
                    <CircleQuestionMark size={40} color="#7D7D7D" />
                  </View>
                  <View className="w-full h-full flex-row items-center justify-between pr-20">
                    <Text
                      className={
                        "text-xl font-bold " +
                        (player.name === idRef?.current
                          ? "text-blue-400"
                          : "text-white")
                      }
                    >
                      {player.name}{" "}
                    </Text>
                    <Text className="text-white text-sm font-bold">
                      Player {index + 1}{" "}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}
