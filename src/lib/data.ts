import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  moq: string;
  leadTime: string;
  image: string;
  featured: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
};

export type Settings = {
  companyName: string;
  tagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroBadge: string;
  aboutTitle: string;
  aboutText: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  moqNote: string;
  leadTimeNote: string;
  complianceNote: string;
  registeredNote: string;
  logo: string;
  favicon: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  footerText: string;
  bangladeshText: string;
};

const defaultSettings: Settings = {
  companyName: 'BIWORSOURCING',
  tagline: 'Apparel Sourcing Agent in Bangladesh',
  heroTitle: 'Need clothes made in Bangladesh?',
  heroHighlight: 'Start here.',
  heroSubtitle: 'A Dhaka buying house. We find the right factory for you.',
  heroBadge: 'Based in Dhaka, Bangladesh',
  aboutTitle: 'A registered buying house, built for global brands.',
  aboutText: '',
  address: 'Dhaka, Bangladesh',
  email: 'info@biworsourcing.com',
  phone: '',
  whatsapp: '',
  moqNote: 'Order from 500 pieces',
  leadTimeNote: '45-Day Average Lead Time',
  complianceNote: 'ACCORD / BSCI / SEDEX / WRAP Factories',
  registeredNote: 'Registered in Bangladesh',
  logo: '',
  favicon: '',
  metaTitle: 'BIWORSOURCING | Apparel Sourcing Agent in Bangladesh',
  metaDescription: 'Registered garment buying house in Dhaka.',
  metaKeywords: 'apparel sourcing Bangladesh',
  ogImage: '',
  footerText: 'A registered apparel buying house in Bangladesh.',
  bangladeshText: '',
};

function readJson<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

function writeJson(filename: string, data: unknown) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2), 'utf-8');
}

export function getProducts(): Product[] {
  return readJson<Product[]>('products.json', []);
}
export function saveProducts(products: Product[]) {
  writeJson('products.json', products);
}

export function getGallery(): GalleryItem[] {
  return readJson<GalleryItem[]>('gallery.json', []);
}
export function saveGallery(items: GalleryItem[]) {
  writeJson('gallery.json', items);
}

export function getSettings(): Settings {
  return { ...defaultSettings, ...readJson<Partial<Settings>>('settings.json', {}) };
}
export function saveSettings(settings: Settings) {
  writeJson('settings.json', settings);
}
