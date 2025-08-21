import { X } from "lucide-react-native";
import React from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

export interface InfoModalContextType {
  openModal: ({
    title,
    message,
    styleKey, // default to "info" if not provided
  }: {
    title: string;
    message: string;
    styleKey?: string;
  }) => void;
  closeModal: () => void;
  isOpen: boolean;
}

export const InfoModalContext = React.createContext<
  InfoModalContextType | undefined
>(undefined);

export const useInfoModalContext = (): InfoModalContextType => {
  const context = React.useContext(InfoModalContext);
  if (!context) {
    throw new Error("useInfoModalContext must be used within a PopupProvider");
  }
  return context;
};

export default function InfoModal({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // States to hold the message / title
  const [title, setTitle] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");

  // Coloring
  const styles: Record<string, string> = {
    error: "bg-zinc-900/95 border-red-900/70",
    warning: "bg-zinc-900/95 border-yellow-700/70",
    info: "bg-blue-800/90 border-blue-900/70",
  };

  const textStyles: Record<string, string> = {
    error: "text-red-500",
    warning: "text-amber-500",
    info: "text-sky-500",
  };

  const defaultStyle = "bg-zinc-800/95 border-zinc-900/70";
  const defaultTextStyle = "text-white";

  const [style, setStyle] = React.useState<string>(defaultStyle);
  const [textStyle, setTextStyle] = React.useState<string>(defaultTextStyle);

  const openModal = ({
    title,
    message,
    styleKey = "info", // default to "info" if not provided
  }: {
    title: string;
    message: string;
    styleKey?: string;
  }) => {
    setTitle(title);
    setMessage(message);
    setStyle(styles[styleKey] || defaultStyle);
    setTextStyle(textStyles[styleKey] || defaultTextStyle);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <InfoModalContext.Provider
      value={{
        openModal,
        closeModal,
        isOpen,
      }}
    >
      {isOpen ? (
        <View className="w-screen h-screen bg-zinc-950/60 absolute top-0 left-0 z-50">
          <View className="flex items-center justify-center h-full">
            <View
              className={
                "p-4 rounded-2xl shadow-lg border-2  w-11/12 max-w-md " + style
              }
            >
              <Text
                className={"text-2xl font-bold mb-4 text-center " + textStyle}
              >
                {title}
              </Text>
              <Text className=" h-14 text-white my-2 mx-3 text-lg text-center">
                {message}{" "}
              </Text>

              <View className="flex flex-row justify-center mt-4">
                <Button onPress={closeModal} color="danger" size="sm">
                  <X size={24} color="red" />

                  <Text className="text-red-500 text-lg font-semibold">
                    Close
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      ) : null}
      {children}
    </InfoModalContext.Provider>
  );
}
