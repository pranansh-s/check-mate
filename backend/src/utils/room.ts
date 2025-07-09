export const generateRoomKey = (activeRoomIds: string[]): string => {
  const randomValues = new Uint8Array(8);
  crypto.getRandomValues(randomValues);

  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  let key: string;
  while (true) {
    key = "";
    for (let i = 0; i < 8; i++) {
      if (i === 3) key += "-";
      else {
        const index = randomValues[i] % characters.length;
        key += characters[index];
      }
    }

    if (!activeRoomIds.includes(key)) {
      break;
    }
  }

  return key;
};
