import { X } from "lucide-react-native";
import React from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

export interface RarityModalContextType {
  openModal: ({
    title,
    message,
    onAllCallback,
    onUncommonCallback,
    onRareCallback,
    onMythicCallback,
    onCancelCallback,
  }: {
    title: string;
    message: string;
    onAllCallback?: () => void;
    onUncommonCallback?: () => void;
    onRareCallback?: () => void;
    onMythicCallback?: () => void;
    onCancelCallback?: () => void;
  }) => void;
  closeModal: () => void;
  isOpen: boolean;
}

export const RarityModalContext = React.createContext<
  RarityModalContextType | undefined
>(undefined);

export const useRarityModalContext = (): RarityModalContextType => {
  const context = React.useContext(RarityModalContext);
  if (!context) {
    throw new Error(
      "useRarityModalContext must be used within a PopupProvider",
    );
  }
  return context;
};

export default function RarityModal({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // States to hold the message / title
  const [title, setTitle] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");

  // Button logic
  const [onAll, setOnAll] = React.useState<(() => void) | undefined>(undefined);

  const [onUncommon, setOnUncommon] = React.useState<(() => void) | undefined>(
    undefined,
  );

  const [onRare, setOnRare] = React.useState<(() => void) | undefined>(
    undefined,
  );

  const [onMythic, setOnMythic] = React.useState<(() => void) | undefined>(
    undefined,
  );

  const [onCancel, setOnCancel] = React.useState<(() => void) | undefined>(
    undefined,
  );

  function openModal({
    title,
    message,
    onAllCallback,
    onUncommonCallback,
    onRareCallback,
    onMythicCallback,
    onCancelCallback,
  }: {
    title: string;
    message: string;
    onAllCallback?: () => void;
    onUncommonCallback?: () => void;
    onRareCallback?: () => void;
    onMythicCallback?: () => void;
    onCancelCallback?: () => void;
  }) {
    if (message !== "" && title !== "") {
      setTitle(title);
      setMessage(message);
      setIsOpen(true);
      setOnAll(() => onAllCallback);
      setOnUncommon(() => onUncommonCallback);
      setOnRare(() => onRareCallback);
      setOnMythic(() => onMythicCallback);
      setOnCancel(() => onCancelCallback);
    }
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <RarityModalContext.Provider
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
                <Button
                  color="uncommon"
                  size="sm"
                  onPress={() => {
                    if (onUncommon) onUncommon();
                    closeModal();
                  }}
                >
                  <Text className="text-stone-100 text-lg font-semibold">
                    Uncommon
                  </Text>
                </Button>
                <Button
                  color="rare"
                  size="sm"
                  onPress={() => {
                    if (onRare) onRare();
                    closeModal();
                  }}
                >
                  <Text className="text-yellow-200 text-lg font-semibold">
                    Rare
                  </Text>
                </Button>
                <Button
                  color="mythic"
                  size="sm"
                  onPress={() => {
                    if (onMythic) onMythic();
                    closeModal();
                  }}
                >
                  <Text className="text-orange-400 text-lg font-semibold">
                    Mythic
                  </Text>
                </Button>
              </View>

              <View className="flex flex-row justify-between mt-2">
                <Button
                  onPress={() => {
                    if (onCancel) onCancel();
                    closeModal();
                  }}
                  color="danger"
                  size="sm"
                >
                  <X size={24} color="red" />

                  <Text className="text-red-500 text-lg font-semibold">
                    Cancel
                  </Text>
                </Button>
                <Button
                  onPress={() => {
                    if (onAll) onAll();
                    closeModal();
                  }}
                  color="success"
                  size="sm"
                >
                  <Text className="text-green-500 text-lg font-semibold">
                    All
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      ) : null}
      {children}
    </RarityModalContext.Provider>
  );
}
