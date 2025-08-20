import React from "react";
import { View, Text, ScrollView } from "react-native";
import { usePlayerContext } from "../internal/playerContext";
import { UsersRound } from "lucide-react-native";

export default function LobbyPlayers({ players }: { players: string[] }) {
  // --------------------------------------------------------------------------------------
  // Context
  const { idRef } = usePlayerContext();
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
          {players.map((player, index) => {
            return (
              <View key={index} className="w-full h-16 my-2">
                <View
                  className=" w-full h-full flex-row items-center gap-3  px-4 py-1 bg-zinc-600/10 rounded-lg"
                  key={index}
                >
                  <View
                    className={
                      "h-12 w-12 bg-zinc-600/40 rounded-full " +
                      (player === idRef?.current
                        ? "border border-blue-300/60"
                        : "")
                    }
                  />
                  <View className="w-full h-full flex-row items-center justify-between pr-20">
                    <Text
                      className={
                        "text-xl font-bold " +
                        (player === idRef?.current
                          ? "text-blue-400"
                          : "text-white")
                      }
                    >
                      {player}{" "}
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
