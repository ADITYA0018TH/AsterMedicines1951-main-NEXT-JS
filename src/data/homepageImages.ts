export const homepageDefaults = {
  hero: {
    src: "https://res.cloudinary.com/diszdorz0/image/upload/v1770127433/aster-medicines/products/AD_OIL_NEW_BOX.webp",
    alt: "Aster AD baby massage oil bottle and carton",
  },
  manufacturing: {
    src: "https://res.cloudinary.com/diszdorz0/image/upload/v1770127431/aster-medicines/products/AD_OIL_170.webp",
    alt: "Aster AD baby massage oil carton",
  },
};

export type HomepageSlot = keyof typeof homepageDefaults;
export type HomepageImages = Partial<typeof homepageDefaults>;

export function homepageImage(images: HomepageImages | undefined, slot: HomepageSlot) {
  return images?.[slot]?.src ? images[slot]! : homepageDefaults[slot];
}
