import { Database } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';

const createTables = async (db: Database) => {
  console.log('Creating tables...');
  
  // Create videos table
  await db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      thumbnailUrl TEXT NOT NULL,
      channelName TEXT NOT NULL,
      viewCount TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      duration TEXT NOT NULL,
      videoUrl TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create favorites table
  await db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      videoId TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (videoId) REFERENCES videos (id) ON DELETE CASCADE,
      UNIQUE(userId, videoId)
    )
  `);
  
  console.log('Tables created successfully');
};

const seedData = async (db: Database) => {
  console.log('Seeding data...');
  
  // Check if videos already exist
  const existingVideos = await db.get('SELECT COUNT(*) as count FROM videos');
  if (existingVideos.count > 0) {
    console.log('Data already exists, skipping seed');
    return;
  }
  
  const mockVideos = [
    {
      id: uuidv4(),
      title: 'Amazing Nature Documentary 2024',
      thumbnailUrl: 'https://picsum.photos/320/180?random=1',
      channelName: 'Nature Channel',
      viewCount: '1.2M',
      timestamp: '2 weeks ago',
      duration: '12:45',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: uuidv4(),
      title: 'Learn React in 30 Minutes',
      thumbnailUrl: 'https://picsum.photos/320/180?random=2',
      channelName: 'Code Masters',
      viewCount: '856K',
      timestamp: '3 days ago',
      duration: '28:15',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: uuidv4(),
      title: 'Morning Coffee Jazz',
      thumbnailUrl: 'https://picsum.photos/320/180?random=3',
      channelName: 'Relaxing Music',
      viewCount: '5.7M',
      timestamp: '1 month ago',
      duration: '2:34:12',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: uuidv4(),
      title: '10 Tips for Better Sleep',
      thumbnailUrl: 'https://picsum.photos/320/180?random=4',
      channelName: 'Health & Wellness',
      viewCount: '423K',
      timestamp: '5 days ago',
      duration: '8:22',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: uuidv4(),
      title: 'Building a Startup from Scratch',
      thumbnailUrl: 'https://picsum.photos/320/180?random=5',
      channelName: 'Entrepreneur TV',
      viewCount: '2.1M',
      timestamp: '2 months ago',
      duration: '45:30',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      id: uuidv4(),
      title: 'Easy Dinner Recipes for Busy Weeknights',
      thumbnailUrl: 'https://picsum.photos/320/180?random=6',
      channelName: 'Cooking Made Simple',
      viewCount: '987K',
      timestamp: '1 week ago',
      duration: '15:45',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
  ];
  
  for (const video of mockVideos) {
    await db.run(
      `INSERT INTO videos (id, title, thumbnailUrl, channelName, viewCount, timestamp, duration, videoUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [video.id, video.title, video.thumbnailUrl, video.channelName, video.viewCount, video.timestamp, video.duration, video.videoUrl]
    );
  }
  
  console.log(`Seeded ${mockVideos.length} videos`);
};

const initDatabase = async () => {
  console.log('Initializing database...');
  
  try {
    const db = new Database();
    await createTables(db);
    await seedData(db);
    await db.close();
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  initDatabase();
}

export { initDatabase }; 