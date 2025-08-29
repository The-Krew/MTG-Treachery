import React from "react";
import { View } from "react-native";

import { cva } from "class-variance-authority";

const headerClasses = cva(
  "w-full h-[6rem] items-center justify-center rounded-2xl",
  {
    variants: {
      bg: {
        light: "bg-zinc-600/40",
        dark: "bg-zinc-800/30",
        transparent: "bg-transparent",
      },
    },
    defaultVariants: {
      bg: "transparent",
    },
  },
);

export default function Header({
  children,
  bg,
}: {
  children: React.ReactNode;
  bg?: "light" | "dark" | "transparent";
}) {
  return <View className={headerClasses({ bg })}>{children}</View>;
}
