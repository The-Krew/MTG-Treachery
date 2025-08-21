import React from "react";
import { Pressable } from "react-native";
import { cva } from "class-variance-authority";

const buttonClasses = cva(
  "transition-colors duration-75 ease-in-out items-center justify-center border ",
  {
    variants: {
      color: {
        primary:
          "border-transparent bg-blue-700/20 active:bg-blue-600/30 active:border-blue-400",
        danger:
          "border-transparent bg-red-800/20 active:bg-red-600/30 active:border-red-400",
        success:
          "border-transparent bg-green-700/20 active:bg-green-600/30 active:border-green-700",
        ghost:
          "border-transparent active:bg-purple-500/20 active:border-purple-400/50",
        active:
          "bg-purple-500/10 border-purple-300/50 active:bg-purple-500/20 active:border-purple-400/50",
      },
      size: {
        tiny: "w-12 h-12",
        xs: "w-14 h-14",
        sm: "w-32 h-16",
        md: "w-44 h-24",
        lg: "w-56 h-32",
        full: "w-full h-full",
      },
      rounded: {
        none: "rounded-none",
        xs: "rounded-sm",
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "md",
      rounded: "md",
    },
  },
);

export function Button({
  color,
  size,
  rounded,
  children,
  onPress,
}: {
  color?: "primary" | "danger" | "success" | "ghost" | "active";
  size?: "sm" | "md" | "lg" | "tiny" | "full" | "xs";
  rounded?: "none" | "xs" | "sm" | "md" | "lg" | "full";
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={buttonClasses({ color, size, rounded })}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}
