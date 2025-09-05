import { Player } from "@/internal/types";
import React from "react";
import { View, Text, Image } from "react-native";
import { usePlayerContext } from "./playerContext";

const roleImages: { [key: string]: string } = {
  Guardian: "https://mtgtreachery.net/images/icon-gdn.png",
  Traitor: "https://mtgtreachery.net/images/icon-trt.png",
  Leader: "https://mtgtreachery.net/images/icon-ldr.png",
  Assassin: "https://mtgtreachery.net/images/icon-ass.png",
  G: "https://mtgtreachery.net/images/icon-gdn.png",
  T: "https://mtgtreachery.net/images/icon-trt.png",
  L: "https://mtgtreachery.net/images/icon-ldr.png",
  A: "https://mtgtreachery.net/images/icon-ass.png",
};

export default function GameRoleTracker() {
  const { players } = usePlayerContext();

  return (
    <View className="w-full h-[10%] bg-zinc-900 rounded-lg flex flex-row gap-2 pt-2 mb-4 justify-center items-center ">
      {players.map((player, index) => {
        return (
          <View key={index}>
            <PlayerAvatar player={player} />
          </View>
        );
      })}
    </View>
  );
}

function PlayerAvatar({ player }: { player: Player }) {
  return (
    <View className="w-12 h-10 flex flex-col items-center justify-center gap-1">
      <Text className="text-white text-sm">{player.name}</Text>
      {player.role === "" ? (
        <View className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700" />
      ) : (
        <Image
          source={{ uri: roleImages[player.role] }}
          className="w-10 h-10"
        />
      )}
    </View>
  );
}
