import { getRoleInfo } from "@/internal/jsonloader";
import { Player } from "@/internal/types";
import React from "react";
import { View, Text, Image } from "react-native";

export default function GameRoleTracker({ players }: { players: Player[] }) {
  return (
    <View className="w-full h-16 bg-zinc-900 rounded-lg flex flex-row gap-2 pt-2 mb-4 justify-center items-center ">
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
  const roleInfo = getRoleInfo(player.role);

  return (
    <View className="w-12 h-10 flex flex-col items-center justify-center gap-1">
      <Text className="text-white text-sm">{player.name}</Text>
      {roleInfo === null ? (
        <View className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700" />
      ) : (
        <Image
          source={{ uri: getRoleInfo(player.role)?.img_src }}
          className="w-10 h-10"
        />
      )}
    </View>
  );
}
