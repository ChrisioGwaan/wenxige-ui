export interface Product {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  origin: string;
  weight: string;
  images: ProductImage[];
  brewingTip?: string;
}

export interface ProductImage {
  id: string;
  alt: string;
  emoji: string;
  bgGradient: string;
}

export const categories = [
  { key: 'all', label: 'All Tea' },
  { key: 'green', label: 'Green Tea' },
  { key: 'black', label: 'Black Tea' },
  { key: 'oolong', label: 'Oolong Tea' },
  { key: 'white', label: 'White Tea' },
  { key: 'puerh', label: "Pu-erh Tea" },
  { key: 'herbal', label: 'Herbal Tea' },
];

export const teaEmojis: Record<string, string> = {
  green: '🍃',
  oolong: '🌿',
  white: '🤍',
  black: '☕',
  puerh: '🫖',
  herbal: '🌸',
};

const makeImages = (emoji: string, name: string): ProductImage[] => [
  { id: '1', alt: `${name} — Loose leaf`, emoji, bgGradient: 'linear-gradient(135deg, rgba(45,80,22,0.08) 0%, rgba(196,163,90,0.08) 100%)' },
  { id: '2', alt: `${name} — Packaging`, emoji: '📦', bgGradient: 'linear-gradient(135deg, rgba(196,163,90,0.1) 0%, rgba(45,80,22,0.06) 100%)' },
  { id: '3', alt: `${name} — Brewed cup`, emoji: '🍵', bgGradient: 'linear-gradient(135deg, rgba(45,80,22,0.06) 0%, rgba(139,90,43,0.08) 100%)' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Dragon Well',
    nameZh: '龙井',
    description:
      'A premium pan-roasted green tea from Hangzhou. Known for its flat, smooth leaves and sweet, nutty flavor with a hint of chestnut.',
    longDescription:
      'Dragon Well (Longjing) is China\'s most celebrated green tea, cultivated in the lush hills surrounding Hangzhou\'s West Lake. Our Dragon Well is hand-picked during the prized pre-Qingming season when the leaves are at their most tender. The flat, sword-shaped leaves undergo meticulous pan-firing by skilled artisans, producing a tea with a smooth, chestnut-like sweetness, a clean vegetal note, and an elegant jade-green liquor. Each sip reveals layers of complexity — from the initial sweetness to a lingering umami finish.',
    price: 28.99,
    originalPrice: 35.99,
    category: 'green',
    tags: ['Bestseller', 'Spring Harvest'],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    origin: 'Hangzhou, Zhejiang',
    weight: '100g',
    images: makeImages('🍃', 'Dragon Well'),
    brewingTip: 'Use 80°C water, steep 2-3 minutes. Re-steep up to 3 times.',
  },
  {
    id: '2',
    name: 'Tie Guan Yin',
    nameZh: '铁观音',
    description:
      'A premium oolong tea with a rich, floral aroma and smooth, buttery taste. Handcrafted using traditional methods.',
    longDescription:
      'Tie Guan Yin, the "Iron Goddess of Mercy," is one of China\'s most treasured oolongs. Grown in the mineral-rich soils of Anxi, Fujian, each leaf is carefully hand-picked and undergoes a complex process of withering, rolling, and partial oxidation. The result is a tea with an intoxicating orchid-like fragrance, a creamy, buttery mouthfeel, and a sweet, lingering finish. Our Tie Guan Yin is lightly roasted in the traditional style, preserving its signature floral character while adding a subtle depth.',
    price: 32.99,
    category: 'oolong',
    tags: ['Premium', 'Traditional'],
    rating: 4.9,
    reviews: 203,
    inStock: true,
    origin: 'Anxi, Fujian',
    weight: '100g',
    images: makeImages('🌿', 'Tie Guan Yin'),
    brewingTip: 'Use 95°C water, steep 30s–1min. Best with a gaiwan. Re-steep 5+ times.',
  },
  {
    id: '3',
    name: 'Silver Needle',
    nameZh: '白毫银针',
    description:
      'The finest white tea made exclusively from young buds. Delicate, sweet, and refreshing with subtle honey notes.',
    longDescription:
      'Silver Needle (Bai Hao Yin Zhen) is the pinnacle of white tea craftsmanship, made exclusively from the plumpest, most tender buds of the Da Bai tea varietal. Harvested during only a few short weeks each spring in Fuding, Fujian, these silvery, downy buds are simply withered and dried — no rolling, no oxidation — preserving their purest essence. The resulting brew is crystal-clear with a delicate sweetness reminiscent of honeydew melon, fresh hay, and white flowers. It is a tea that rewards patience and contemplation.',
    price: 45.99,
    category: 'white',
    tags: ['Rare', 'Limited Edition'],
    rating: 4.7,
    reviews: 89,
    inStock: true,
    origin: 'Fuding, Fujian',
    weight: '50g',
    images: makeImages('🤍', 'Silver Needle'),
    brewingTip: 'Use 85°C water, steep 3-5 minutes. Gentle and forgiving — hard to overbrew.',
  },
  {
    id: '4',
    name: 'Keemun Black Tea',
    nameZh: '祁门红茶',
    description:
      'A renowned Chinese black tea with a complex, slightly smoky flavor and hints of wine and fruit.',
    longDescription:
      'Keemun (Qimen) black tea has been prized since the late 19th century and was once the tea of choice for British afternoon tea. Grown in the misty, mountainous Qimen county of Anhui province, this tea undergoes a meticulous full oxidation process that develops its signature complexity. Expect a rich, wine-like body with notes of stone fruit, cocoa, and a whisper of pine smoke. The aroma alone — often described as the "Keemun fragrance" — is enough to captivate any tea lover.',
    price: 24.99,
    category: 'black',
    tags: ['Classic'],
    rating: 4.6,
    reviews: 134,
    inStock: true,
    origin: 'Qimen, Anhui',
    weight: '100g',
    images: makeImages('☕', 'Keemun Black Tea'),
    brewingTip: 'Use 90°C water, steep 3-4 minutes. Excellent with a splash of milk.',
  },
  {
    id: '5',
    name: 'Aged Pu-erh Cake',
    nameZh: '普洱茶饼',
    description:
      'A 10-year aged pu-erh tea cake with deep, earthy flavors and smooth, mellow character. Perfect for collectors.',
    longDescription:
      'This 10-year aged Shou (ripe) Pu-erh cake is a testament to the transformative power of time. Sourced from ancient tea trees in Yunnan\'s mountains, the leaves undergo a unique microbial fermentation process before being compressed into traditional 357g cakes and aged in controlled conditions. Over the years, the tea has developed a remarkably smooth, velvety body with rich notes of dark chocolate, dried dates, and forest floor. Zero astringency — pure, meditative depth in every cup.',
    price: 89.99,
    originalPrice: 110.0,
    category: 'puerh',
    tags: ['Aged', 'Collector'],
    rating: 4.9,
    reviews: 67,
    inStock: true,
    origin: 'Yunnan',
    weight: '357g',
    images: makeImages('🫖', 'Aged Pu-erh Cake'),
    brewingTip: 'Rinse once with boiling water, then steep 10-15s. Re-steep 10+ times.',
  },
  {
    id: '6',
    name: 'Jasmine Pearl',
    nameZh: '茉莉龙珠',
    description:
      'Hand-rolled green tea pearls infused with fresh jasmine blossoms. Unfurls beautifully in hot water.',
    longDescription:
      'Our Jasmine Pearls are a masterwork of scented tea artistry. Premium green tea leaves from Fuzhou are hand-rolled into tight pearls, then repeatedly layered with fresh jasmine blossoms during the night when the flowers release their maximum fragrance. This labor-intensive process is repeated over several nights, allowing the tea to absorb deep, heady jasmine perfume. When brewed, the pearls slowly unfurl in your cup — a mesmerizing display — releasing a sweet, floral liquor that is both soothing and invigorating.',
    price: 26.99,
    category: 'green',
    tags: ['Aromatic', 'Popular'],
    rating: 4.8,
    reviews: 245,
    inStock: true,
    origin: 'Fuzhou, Fujian',
    weight: '100g',
    images: makeImages('🍃', 'Jasmine Pearl'),
    brewingTip: 'Use 85°C water, steep 2-3 minutes. Beautiful in a glass cup.',
  },
  {
    id: '7',
    name: 'Da Hong Pao',
    nameZh: '大红袍',
    description:
      'A legendary rock oolong from the Wuyi Mountains. Rich, roasted character with mineral notes and lingering sweetness.',
    longDescription:
      'Da Hong Pao ("Big Red Robe") is the most legendary of all Wuyi Rock Oolongs, steeped in centuries of myth and imperial tribute. Our Da Hong Pao is sourced from gardens in the rocky, mineral-rich Wuyi Mountain crevices, where the unique terroir imparts the prized "yan yun" (rock rhyme). Masterfully roasted over charcoal, it develops a complex profile of toasted grains, dark caramel, stone fruit, and a distinct mineral backbone. The long, sweet aftertaste lingers for minutes — a hallmark of truly exceptional rock tea.',
    price: 55.99,
    category: 'oolong',
    tags: ['Premium', 'Rock Oolong'],
    rating: 4.9,
    reviews: 178,
    inStock: true,
    origin: 'Wuyi, Fujian',
    weight: '50g',
    images: makeImages('🌿', 'Da Hong Pao'),
    brewingTip: 'Use 98°C water, steep 20-30s. Best with a small Yixing clay pot.',
  },
  {
    id: '8',
    name: 'Chrysanthemum Tea',
    nameZh: '菊花茶',
    description:
      'Whole dried chrysanthemum flowers that produce a light, floral, and naturally sweet infusion. Caffeine-free.',
    longDescription:
      'Our Chrysanthemum Tea features premium whole Hang Bai Ju flowers from the fields surrounding Hangzhou. These beautiful golden blooms are carefully dried to preserve their shape, color, and delicate flavor. When steeped, they produce a pale golden liquor with a naturally sweet, honey-like taste and a cooling, refreshing finish. In traditional Chinese wellness, chrysanthemum tea is cherished for its soothing properties. Completely caffeine-free, it\'s perfect any time of day.',
    price: 18.99,
    category: 'herbal',
    tags: ['Caffeine-Free', 'Relaxing'],
    rating: 4.5,
    reviews: 112,
    inStock: true,
    origin: 'Hangzhou, Zhejiang',
    weight: '80g',
    images: makeImages('🌸', 'Chrysanthemum Tea'),
    brewingTip: 'Use 95°C water, steep 3-5 minutes. Add rock sugar or goji berries.',
  },
  {
    id: '9',
    name: 'Bi Luo Chun',
    nameZh: '碧螺春',
    description:
      'A famous green tea with tightly rolled leaves. Produces a fresh, fruity infusion with floral overtones.',
    longDescription:
      'Bi Luo Chun ("Green Snail Spring") is one of China\'s most beloved green teas, grown among fruit orchards on the shores of Lake Tai in Suzhou. The proximity to peach, plum, and apricot trees subtly infuses the tea with fruity aromatics that make it truly unique. Each tiny, spiral-rolled leaf is covered in fine white down — a sign of exceptional quality. The brew is bright, fresh, and bursting with floral-fruity notes, making it an uplifting and elegant tea for any occasion.',
    price: 34.99,
    category: 'green',
    tags: ['Spring Harvest', 'Artisan'],
    rating: 4.7,
    reviews: 91,
    inStock: true,
    origin: 'Suzhou, Jiangsu',
    weight: '100g',
    images: makeImages('🍃', 'Bi Luo Chun'),
    brewingTip: 'Use 75°C water, steep 1-2 minutes. Very delicate — avoid boiling water.',
  },
  {
    id: '10',
    name: 'Lapsang Souchong',
    nameZh: '正山小种',
    description:
      'The original smoked black tea. Pine-smoked over fires for a distinctive, bold flavor unlike any other tea.',
    longDescription:
      'Lapsang Souchong is the world\'s first black tea, originating from the Tongmu village deep in the Wuyi Mountains. Our Zhengshan Xiaozhong is the genuine article — made from local small-leaf varietal and gently smoked over smoldering pine wood. The result is a bold, aromatic tea with layers of pine smoke, longan fruit, dried apricot, and a sweet, clean finish that defies expectations. Unlike harsh imitations, authentic Lapsang Souchong is refined and complex, converting even the most skeptical tea drinkers.',
    price: 22.99,
    category: 'black',
    tags: ['Smoky', 'Bold'],
    rating: 4.4,
    reviews: 156,
    inStock: true,
    origin: 'Wuyi, Fujian',
    weight: '100g',
    images: makeImages('☕', 'Lapsang Souchong'),
    brewingTip: 'Use 95°C water, steep 3-4 minutes. Pairs wonderfully with cheese.',
  },
  {
    id: '11',
    name: 'Goji Berry Herbal',
    nameZh: '枸杞茶',
    description:
      'A nourishing blend of dried goji berries, red dates, and chrysanthemum. Naturally sweet and full of antioxidants.',
    longDescription:
      'This traditional wellness blend combines plump Ningxia goji berries, sweet red dates (jujube), and chrysanthemum flowers — a time-honored combination in Chinese herbalism. The goji berries lend a gentle sweetness and beautiful ruby color to the brew, while the red dates add body and warmth. The chrysanthemum rounds it out with a cooling, floral note. Rich in natural antioxidants and completely caffeine-free, this is the perfect nourishing drink for any time of day.',
    price: 19.99,
    category: 'herbal',
    tags: ['Health', 'Caffeine-Free'],
    rating: 4.6,
    reviews: 88,
    inStock: true,
    origin: 'Ningxia',
    weight: '120g',
    images: makeImages('🌸', 'Goji Berry Herbal'),
    brewingTip: 'Use boiling water, steep 5+ minutes. Eat the goji berries after drinking!',
  },
  {
    id: '12',
    name: 'Moonlight White',
    nameZh: '月光白',
    description:
      'A unique white tea from Yunnan with one silver and one dark side per leaf. Subtle, sweet, and complex.',
    longDescription:
      'Moonlight White (Yue Guang Bai) is a hauntingly beautiful tea from Yunnan\'s Jinggu region, named for its distinctive leaves — silver-white on one side and deep charcoal on the other, resembling moonlight and shadow. Made from large-leaf Yunnan varietals and processed using white tea methods, it bridges the world between white and pu-erh. The flavor is uniquely layered: floral honey, ripe pear, and a hint of hay, with a silky texture that evolves beautifully over multiple steepings.',
    price: 38.99,
    category: 'white',
    tags: ['Unique', 'Yunnan'],
    rating: 4.7,
    reviews: 54,
    inStock: false,
    origin: 'Jinggu, Yunnan',
    weight: '100g',
    images: makeImages('🤍', 'Moonlight White'),
    brewingTip: 'Use 90°C water, steep 2-3 minutes. Ages beautifully like pu-erh.',
  },
];
