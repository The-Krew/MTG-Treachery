import { Check, X } from "lucide-react-native";
import React from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

export interface ConfirmModalContextType {
  openModal: ({
    title,
    message,
    onAcceptCallback,
  }: {
    title: string;
    message: string;
    onAcceptCallback?: () => void;
  }) => void;
  closeModal: () => void;
  isOpen: boolean;
}

export const ConfirmModalContext = React.createContext<
  ConfirmModalContextType | undefined
>(undefined);

export const useConfirmModalContext = (): ConfirmModalContextType => {
  const context = React.useContext(ConfirmModalContext);
  if (!context) {
    throw new Error(
      "useConfirmModalContext must be used within a PopupProvider",
    );
  }
  return context;
};

export default function ConfirmModal({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // States to hold the message / title
  const [title, setTitle] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");

  // Button logic
  const [onAccept, setOnAccept] = React.useState<(() => void) | undefined>(
    undefined,
  );

  function openModal({
    title,
    message,
    onAcceptCallback,
  }: {
    title: string;
    message: string;
    onAcceptCallback?: () => void;
  }) {
    if (message !== "" && title !== "") {
      setTitle(title);
      setMessage(message);
      setIsOpen(true);
      setOnAccept(() => onAcceptCallback);
    }
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ConfirmModalContext.Provider
      value={{
        openModal,
        closeModal,
        isOpen,
      }}
    >
      {isOpen ? (
        <View className="w-screen h-screen bg-zinc-950/60 absolute top-0 left-0 z-50">
          <View className="flex items-center justify-center h-full">
            <View className="bg-zinc-800/95 p-4 rounded-2xl shadow-lg border border-zinc-900/70 w-11/12 max-w-md">
              <Text className="text-2xl font-bold text-white mb-4 text-center">
                {title}
              </Text>
              <Text className=" h-12 text-white my-2 mx-3 text-lg">
                {message}{" "}
              </Text>

              <View className="flex flex-row justify-between mt-4">
                <Button onPress={closeModal} color="danger" size="sm">
                  <X size={24} color="red" />

                  <Text className="text-red-500 text-lg font-semibold">
                    Cancel
                  </Text>
                </Button>
                <Button
                  onPress={() => {
                    if (onAccept) onAccept();
                    closeModal();
                  }}
                  color="success"
                  size="sm"
                >
                  <Check size={24} color="green" />
                  <Text className="text-green-500 text-lg font-semibold">
                    Accept{" "}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      ) : null}
      {children}
    </ConfirmModalContext.Provider>
  );
}
