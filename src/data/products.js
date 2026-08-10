/**
 * Product Catalog — Itris Bazar
 * All prices in MAD (Moroccan Dirham)
 * Images reference public/images/products/<slug>/1.jpeg, 2.jpeg, 3.jpeg
 */

export const categories = [
  {
    id: 'wall-tapestry',
    name: 'Wall Tapestries',
    slug: 'wall-tapestry',
    description: 'Transform your walls into magical spaces with our hand-selected celestial and alternative tapestries.',
  },
  {
    id: 'tarot-cards',
    name: 'Tarot Cards',
    slug: 'tarot-cards',
    description: 'Mystical decks crafted for divination, collection, and ritual. Elegantly illustrated dark fantasy art.',
  },
];

export const products = [
  {
    id: 1,
    name: 'Tree Of Life',
    slug: 'tree-of-life',
    category: 'wall-tapestry',
    price: 80,
    images: [
      '/images/products/tree-of-life/1.jpeg',
      '/images/products/tree-of-life/2.jpeg',
      '/images/products/tree-of-life/3.jpeg',
    ],
    shortDescription: 'Ancient roots reaching into the cosmos — a symbol of eternal connection between earth and the celestial.',
    description: 'The Tree of Life tapestry weaves together themes of growth, rebirth, and the interconnected nature of all living things. Printed on premium polyester fabric with vivid, fade-resistant inks. Lightweight and easy to hang. Perfect for bedrooms, meditation rooms, or any sacred space.',
    featured: true,
  },
  {
    id: 2,
    name: 'Cat',
    slug: 'cat',
    category: 'wall-tapestry',
    price: 120,
    images: [
      '/images/products/cat/1.jpeg',
      '/images/products/cat/2.jpeg',
      '/images/products/cat/3.jpeg',
    ],
    shortDescription: 'The mystical feline — guardian of the spirit world and companion of witches through the ages.',
    description: 'Celebrate the enigmatic bond between humans and cats with this beautifully detailed celestial tapestry. Features intricate dark art styling with rich tonal depth. Printed on soft-touch polyester with reinforced edges for longevity. A must-have for cat lovers who embrace the alternative aesthetic.',
    featured: true,
  },
  {
    id: 3,
    name: 'Snake',
    slug: 'snake',
    category: 'wall-tapestry',
    price: 120,
    images: [
      '/images/products/snake/1.jpeg',
      '/images/products/snake/2.jpeg',
      '/images/products/snake/3.jpeg',
    ],
    shortDescription: 'Symbol of transformation and hidden knowledge — the serpent coils through ancient mystery.',
    description: 'Embrace the serpentine energy of transformation with this stunning alternative wall tapestry. The snake has been revered across cultures as a symbol of rebirth, wisdom, and the cyclical nature of existence. Exquisite dark-toned printing on premium fabric. Ideal for those drawn to occult and esoteric aesthetics.',
    featured: false,
  },
  {
    id: 4,
    name: 'Moon White Banner',
    slug: 'moon-white-banner',
    category: 'wall-tapestry',
    price: 149,
    images: [
      '/images/products/moon-white-banner/1.jpeg',
      '/images/products/moon-white-banner/2.jpeg',
      '/images/products/moon-white-banner/3.jpeg',
    ],
    shortDescription: 'Lunar phases in ethereal white — a banner-style tapestry capturing the moon\'s celestial dance.',
    description: 'This elegant banner-format tapestry showcases the phases of the moon in a vertical arrangement. The white variant offers a softer, ethereal contrast against dark walls. Premium quality print with hemmed edges and a wooden dowel slot for effortless hanging. A statement piece for lunar devotees.',
    featured: true,
  },
  {
    id: 5,
    name: 'Moon Black Banner',
    slug: 'moon-black-banner',
    category: 'wall-tapestry',
    price: 149,
    images: [
      '/images/products/moon-black-banner/1.jpeg',
      '/images/products/moon-black-banner/2.jpeg',
      '/images/products/moon-black-banner/3.jpeg',
    ],
    shortDescription: 'Lunar phases on deep black — the darker twin for those who prefer shadow over light.',
    description: 'The dark counterpart to our White Moon Banner. Displaying the complete lunar cycle on a deep black background, this banner tapestry radiates mysterious elegance. Same premium construction with hemmed edges and dowel slot. Pair both variants together for a stunning celestial display.',
    featured: false,
  },
  {
    id: 6,
    name: 'Crystal Garden',
    slug: 'crystal-garden',
    category: 'wall-tapestry',
    price: 120,
    images: [
      '/images/products/crystal-garden/1.jpeg',
      '/images/products/crystal-garden/2.jpeg',
      '/images/products/crystal-garden/3.jpeg',
    ],
    shortDescription: 'A mystical garden of healing crystals blooming with spiritual energy and earthen power.',
    description: 'Bring the healing energy of crystals into your space with this enchanting tapestry. Featuring an intricate garden scene woven with amethyst, quartz, and obsidian motifs. Printed on premium fade-resistant polyester. Perfect for crystal enthusiasts and those who draw strength from the earth\'s minerals.',
    featured: true,
  },
  {
    id: 7,
    name: 'Classic Tarot',
    slug: 'classic-tarot',
    category: 'tarot-cards',
    price: 160,
    images: [
      '/images/products/classic-tarot/1.jpeg',
      '/images/products/classic-tarot/2.jpeg',
      '/images/products/classic-tarot/3.jpeg',
    ],
    shortDescription: 'A complete 78-card deck with dark celestial illustrations — your gateway to divination.',
    description: 'This complete 78-card tarot deck features original dark celestial illustrations printed on 350gsm premium cardstock with a soft-matte lamination finish. Each card is carefully designed to channel the traditional Rider-Waite-Smith symbolism through an alternative artistic lens. Comes with a velvet storage pouch and introductory guidebook. Perfect for both beginners and experienced readers.',
    featured: true,
  },
  {
    id: 8,
    name: 'Sunfyre',
    slug: 'sunfyre',
    category: 'wall-tapestry',
    price: 149,
    images: [
      '/images/products/sunfyre/1.jpeg',
      '/images/products/sunfyre/2.jpeg',
      '/images/products/sunfyre/3.jpeg',
    ],
    shortDescription: 'A blazing tribute to solar fire — golden flames dancing across a dark celestial canvas.',
    description: 'Inspired by the fierce beauty of solar mythology, the Sunfyre tapestry features rich golden tones against a deep, dark backdrop. The design evokes the raw power and majesty of the sun as it was worshipped by ancient civilizations. Premium print quality with vibrant, long-lasting colors. A striking centrepiece for any alternative living space.',
    featured: false,
  },
];
