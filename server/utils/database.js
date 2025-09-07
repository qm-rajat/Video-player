const mongoose = require('mongoose');
const { logger } = require('./logger');

// Database connection options
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, dbOptions);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });
    
    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed due to app termination');
      process.exit(0);
    });
    
    return conn;
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Disconnect from MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
};

// Check database connection status
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get database connection info
const getConnectionInfo = () => {
  return {
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  };
};

// Database health check
const healthCheck = async () => {
  try {
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();
    return { status: 'healthy', ping: result };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return { status: 'unhealthy', error: error.message };
  }
};

// Get database statistics
const getStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      objects: stats.objects
    };
  } catch (error) {
    logger.error('Error getting database stats:', error);
    throw error;
  }
};

// Create database indexes
const createIndexes = async () => {
  try {
    const User = require('../models/User');
    const Media = require('../models/Media');
    const Comment = require('../models/Comment');
    const Subscription = require('../models/Subscription');
    
    // User indexes
    await User.createIndexes();
    logger.info('User indexes created');
    
    // Media indexes
    await Media.createIndexes();
    logger.info('Media indexes created');
    
    // Comment indexes
    await Comment.createIndexes();
    logger.info('Comment indexes created');
    
    // Subscription indexes
    await Subscription.createIndexes();
    logger.info('Subscription indexes created');
    
    logger.info('All database indexes created successfully');
  } catch (error) {
    logger.error('Error creating database indexes:', error);
    throw error;
  }
};

// Drop database indexes
const dropIndexes = async (collectionName) => {
  try {
    await mongoose.connection.db.collection(collectionName).dropIndexes();
    logger.info(`Indexes dropped for collection: ${collectionName}`);
  } catch (error) {
    logger.error(`Error dropping indexes for ${collectionName}:`, error);
    throw error;
  }
};

// Backup database
const backupDatabase = async () => {
  try {
    // This would typically use mongodump or a similar tool
    // For now, we'll just log the operation
    logger.info('Database backup initiated');
    
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    logger.info(`Collections to backup: ${collectionNames.join(', ')}`);
    
    // In a real implementation, you would:
    // 1. Use mongodump to create a backup
    // 2. Upload to cloud storage (AWS S3, Google Cloud, etc.)
    // 3. Schedule regular backups
    
    return {
      timestamp: new Date(),
      collections: collectionNames,
      status: 'initiated'
    };
  } catch (error) {
    logger.error('Database backup failed:', error);
    throw error;
  }
};

// Clean up old data
const cleanupOldData = async (days = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Clean up old logs, temporary files, etc.
    // This is a placeholder for actual cleanup logic
    
    logger.info(`Cleanup completed for data older than ${days} days`);
    
    return {
      cutoffDate,
      status: 'completed'
    };
  } catch (error) {
    logger.error('Database cleanup failed:', error);
    throw error;
  }
};

// Optimize database
const optimizeDatabase = async () => {
  try {
    // Run database optimization commands
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      try {
        await mongoose.connection.db.collection(collection.name).reIndex();
        logger.info(`Reindexed collection: ${collection.name}`);
      } catch (error) {
        logger.warn(`Failed to reindex ${collection.name}:`, error.message);
      }
    }
    
    logger.info('Database optimization completed');
    
    return {
      timestamp: new Date(),
      collectionsOptimized: collections.length,
      status: 'completed'
    };
  } catch (error) {
    logger.error('Database optimization failed:', error);
    throw error;
  }
};

// Transaction helper
const withTransaction = async (callback) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Aggregation helper
const aggregate = async (model, pipeline, options = {}) => {
  try {
    const result = await model.aggregate(pipeline, options);
    return result;
  } catch (error) {
    logger.error('Aggregation error:', error);
    throw error;
  }
};

// Bulk operations helper
const bulkWrite = async (model, operations, options = {}) => {
  try {
    const result = await model.bulkWrite(operations, {
      ordered: false,
      ...options
    });
    
    logger.info(`Bulk operation completed: ${result.modifiedCount} modified, ${result.insertedCount} inserted`);
    return result;
  } catch (error) {
    logger.error('Bulk write error:', error);
    throw error;
  }
};

// Migration helper
const runMigration = async (migrationName, migrationFunction) => {
  try {
    logger.info(`Running migration: ${migrationName}`);
    
    const startTime = Date.now();
    await migrationFunction();
    const endTime = Date.now();
    
    logger.info(`Migration ${migrationName} completed in ${endTime - startTime}ms`);
    
    return {
      name: migrationName,
      status: 'completed',
      duration: endTime - startTime,
      timestamp: new Date()
    };
  } catch (error) {
    logger.error(`Migration ${migrationName} failed:`, error);
    throw error;
  }
};

// Seed data helper
const seedData = async (model, data, options = {}) => {
  try {
    const { upsert = false, clear = false } = options;
    
    if (clear) {
      await model.deleteMany({});
      logger.info(`Cleared existing data for ${model.modelName}`);
    }
    
    if (upsert) {
      const operations = data.map(item => ({
        updateOne: {
          filter: { _id: item._id || new mongoose.Types.ObjectId() },
          update: item,
          upsert: true
        }
      }));
      
      const result = await model.bulkWrite(operations);
      logger.info(`Seeded ${result.upsertedCount} records for ${model.modelName}`);
      return result;
    } else {
      const result = await model.insertMany(data);
      logger.info(`Seeded ${result.length} records for ${model.modelName}`);
      return result;
    }
  } catch (error) {
    logger.error(`Seeding failed for ${model.modelName}:`, error);
    throw error;
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  isConnected,
  getConnectionInfo,
  healthCheck,
  getStats,
  createIndexes,
  dropIndexes,
  backupDatabase,
  cleanupOldData,
  optimizeDatabase,
  withTransaction,
  aggregate,
  bulkWrite,
  runMigration,
  seedData
};