import mongoose from 'mongoose';
import ENV from './utils/env.js';
import User from './models/user.js';
import MenuItem from './models/menuItem.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      googleId: 'demo-google-id'
    });
    await adminUser.save();
    console.log('Admin user created:', adminUser.email);

    // Create sample menu items
    const shopMenu = new MenuItem({
      title: 'Shop',
      slug: 'shop',
      order: 0,
      isActive: true,
      columns: [
        {
          heading: 'View All',
          order: 0,
          items: [
            { label: 'All Products', link: '/shop', order: 0 },
            { label: 'New Arrivals', link: '/shop?filter=new', order: 1 }
          ]
        },
        {
          heading: 'Categories',
          order: 1,
          items: [
            { label: 'Blouses & Tops', link: '/category/blouses-tops', order: 0 },
            { label: 'Dresses', link: '/category/dresses', order: 1 },
            { label: 'Bottoms', link: '/category/bottoms', order: 2 }
          ]
        }
      ],
      images: []
    });
    await shopMenu.save();
    console.log('Shop menu created');

    const collectionsMenu = new MenuItem({
      title: 'Collections',
      slug: 'collections',
      order: 1,
      isActive: true,
      columns: [
        {
          heading: 'Recent',
          order: 0,
          items: [
            { label: 'Spring 2024', link: '/collection/spring-2024', order: 0 }
          ]
        },
        {
          heading: 'Curated',
          order: 1,
          items: [
            { label: 'Flora', link: '/collection/flora', order: 0 },
            { label: 'Urban', link: '/collection/urban', order: 1 }
          ]
        }
      ],
      images: []
    });
    await collectionsMenu.save();
    console.log('Collections menu created');

    const tribeMenu = new MenuItem({
      title: 'Tribe-88',
      slug: 'tribe-88',
      order: 2,
      isActive: true,
      columns: [
        {
          heading: 'Community',
          order: 0,
          items: [
            { label: 'Our Story', link: '/tribe', order: 0 },
            { label: 'Members', link: '/tribe/members', order: 1 },
            { label: 'Events', link: '/tribe/events', order: 2 }
          ]
        }
      ],
      images: []
    });
    await tribeMenu.save();
    console.log('Tribe-88 menu created');

    console.log('Database seeding completed successfully!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
