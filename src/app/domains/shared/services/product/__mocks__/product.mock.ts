import { ProductModel } from '@model/product.model';

export const ProductListMock: ProductModel[] = [
  {
    id: 210,
    title: 'Elegant Purple Leather Loafers',
    slug: 'elegant-purple-leather-loafers',
    price: 16,
    description:
      "Step into sophistication with our Elegant Purple Leather Loafers, perfect for making a bold statement. Crafted from high-quality leather with a vibrant purple finish, these shoes feature a classic loafer silhouette that's been updated with a contemporary twist. The comfortable slip-on design and durable soles ensure both style and functionality for the modern man.",
    category: {
      id: 92,
      name: 'Shoes',
      slug: 'shoes',
      image: 'https://i.imgur.com/qNOjJje.jpeg',
    },
    images: ['https://i.imgur.com/Au8J9sX.jpeg'],
    creationAt: '2025-08-06T06:53:11.000Z',
  },
  {
    id: 212,
    title: 'Futuristic Chic High-Heel Boots',
    slug: 'futuristic-chic-high-heel-boots',
    price: 36,
    description:
      'Elevate your style with our cutting-edge high-heel boots that blend bold design with avant-garde aesthetics. These boots feature a unique color-block heel, a sleek silhouette, and a versatile light grey finish that pairs easily with any cutting-edge outfit. Crafted for the fashion-forward individual, these boots are sure to make a statement.',
    category: {
      id: 92,
      name: 'Shoes',
      slug: 'shoes',
      image: 'https://i.imgur.com/qNOjJje.jpeg',
    },
    images: [
      'https://i.imgur.com/HqYqLnW.jpeg',
      'https://i.imgur.com/RlDGnZw.jpeg',
      'https://i.imgur.com/qa0O6fg.jpeg',
    ],
    creationAt: '2025-08-06T06:53:11.000Z',
  },
];
