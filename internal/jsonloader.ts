import jsonData from "@/images/treachery-cards.json";
import images from "@/images/card_images.json";

export const roles = ["Guardian", "Assassin", "Traitor", "Leader"];

const roleImages: { [key: string]: string } = {
  Guardian: "https://mtgtreachery.net/images/icon-gdn.png",
  Traitor: "https://mtgtreachery.net/images/icon-trt.png",
  Leader: "https://mtgtreachery.net/images/icon-ldr.png",
  Assassin: "https://mtgtreachery.net/images/icon-ass.png",
};

const guardianCards = jsonData["guardian"];
const assassinCards = jsonData["assassin"];
const traitorCards = jsonData["traitor"];
const leaderCards = jsonData["leader"];

export const cardClasses = [
  guardianCards,
  assassinCards,
  traitorCards,
  leaderCards,
];
const classImages = [
  images["guardian"],
  images["assassin"],
  images["traitor"],
  images["leader"],
];

export const getRandomClassIndex = () => {
  const randomIndex = Math.floor(Math.random() * cardClasses.length);
  return randomIndex;
};

export const getRandomCardIndex = (cardClass: any) => {
  const randomIndex = Math.floor(Math.random() * cardClass.length);
  return randomIndex;
};

export const getRoleInfo = (role: number) => {
  if (role < 0 || role >= roles.length) {
    console.error(`Role index ${role} is out of bounds`);
    return null;
  }
  return {
    name: roles[role],
    img_src: roleImages[roles[role]],
  };
};

export const getCardInfo = (classI: number, cardI: number) => {
  const cardClass = cardClasses[classI];
  if (cardClass === undefined) {
    console.error(`Class index ${classI} is out of bounds`);
    return null;
  }

  const card = cardClass[cardI];
  if (card === undefined) {
    console.error(
      `Card index ${cardI} is out of bounds for class index ${classI}`,
    );
    return null;
  }

  return card;
};

export const getCardImage = (classI: number, cardI: number) => {
  const imageClass = classImages[classI];
  if (imageClass === undefined) {
    console.error(`Image class index ${classI} is out of bounds`);
    return null;
  }

  const imageCard = imageClass[cardI];
  if (imageCard === undefined) {
    console.error(
      `Image not found for class index ${classI} and card index ${cardI}`,
    );
    return null;
  }

  return imageCard["img_src"];
};
