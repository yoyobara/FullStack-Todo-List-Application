# MongoDB to PostgreSQL Migration Guide

This document outlines the changes made to migrate the Todo List Application from MongoDB/Mongoose to PostgreSQL/Sequelize.

## Changes Made

### 1. **Dependencies Updated** (`package.json`)

- **Removed**: `mongoose` (^6.2.4)
- **Added**:
  - `pg` (^8.10.0) - PostgreSQL node driver
  - `sequelize` (^6.35.2) - ORM for PostgreSQL
  - `sequelize-cli` (^6.6.2) - CLI tools for migrations

### 2. **Database Configuration**

- **Removed**: `config/mongoose.js` (MongoDB connection)
- **Created**: `config/sequelize.js` (PostgreSQL/Sequelize connection)
  - Uses environment variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

### 3. **Data Models**

- **Updated**: `models/task.js`
  - Changed from Mongoose Schema to Sequelize Model
  - Primary key changed from MongoDB ObjectId to UUID
  - Added `createdAt` and `updatedAt` timestamps
  - Table name: `tasks`

### 4. **Controllers Updated**

All controllers converted from callback-based Mongoose to async/await Sequelize:

- **`controllers/home_controller.js`**
  - `Task.find()` → `Task.findAll()`
  - Added proper async/await error handling

- **`controllers/tasks_controller.js`**
  - `Task.create()` → `Task.create()`
  - `Task.findByIdAndDelete()` → `Task.destroy()`
  - `Task.findByIdAndUpdate()` → `Task.update()`
  - `Task.deleteMany()` → `Task.destroy()`
  - `Task.updateMany()` → `Task.update()`

- **`controllers/api/tasks_api_controller.js`**
  - `Task.find()` → `Task.findAll()`
  - `Task.findById()` → `Task.findByPk()`
  - `Task.findByIdAndUpdate()` → `Task.update()`
  - `Task.findByIdAndDelete()` → `Task.destroy()`

### 5. **Database Initialization** (`index.js`)

- Changed from `require('./config/mongoose.js')` to `require('./config/sequelize.js')`
- Added `sequelize.sync({ alter: true })` to automatically create/update tables on startup
- Database sync happens before server starts

### 6. **Docker Compose Files**

Both `docker-compose.yml` and `docker-compose-buildless.yml` updated:

- **Removed**: MongoDB service
- **Added**: PostgreSQL 15 service
- **Environment variables**: Updated to PostgreSQL connection parameters

### 7. **Environment Variables**

Created `.env.example` file with required PostgreSQL configuration:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todo_list
```

### 8. **Migration Scripts**

- **Created**: `migrations/001-create-tasks.js` - Schema definition for tasks table
- **Created**: `scripts/migrate.js` - Manual migration runner (optional)

## Setup Instructions

### Local Development

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**

   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

3. **Create PostgreSQL Database**

   ```bash
   createdb todo_list
   # Or use PostgreSQL client/pgAdmin to create database manually
   ```

4. **Start Application**
   ```bash
   npm start
   ```
   The application will automatically sync the database schema on startup.

### Docker Setup

1. **Build and Run with Docker Compose**

   ```bash
   docker-compose up -d
   ```

   This will:
   - Start a PostgreSQL container
   - Build and start the Node.js app container
   - Automatically sync the database schema

2. **Stop Services**
   ```bash
   docker-compose down
   ```

### Manual Database Migration (Optional)

If you need to run migrations manually:

```bash
node scripts/migrate.js
```

## Data Migration from MongoDB

To migrate existing data from MongoDB to PostgreSQL:

1. Export data from MongoDB:

   ```bash
   mongoexport --collection tasks --out tasks.json
   ```

2. Transform JSON data if needed (UUID format for IDs)

3. Create a migration script to import into PostgreSQL:
   ```bash
   # Use your preferred data import method (bulk insert, etc.)
   ```

## Database Schema Comparison

### MongoDB (Old)

- ObjectId for \_id
- No timestamps by default
- Schema-less flexibility

### PostgreSQL (New)

- UUID for id
- createdAt and updatedAt timestamps
- Strict schema definition
- ACID transactions support

## Key Differences to Note

1. **ID Format**: MongoDB ObjectId vs PostgreSQL UUID
2. **Async Handling**: Mongoose callbacks → Sequelize async/await
3. **Query Methods**:
   - `find()` → `findAll()`
   - `findById()` → `findByPk()`
   - `findByIdAndDelete()` → `destroy()`
   - `findByIdAndUpdate()` → `update()`

4. **Database Synchronization**: Uses `sequelize.sync()` for automatic schema management

## Troubleshooting

### Connection Issues

- Verify PostgreSQL is running and accessible
- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` environment variables
- Test connection: `psql -U postgres -h localhost -W`

### Schema Errors

- If using `alter: true` in sync options, schema changes are tracked
- For production, consider using explicit migrations with `sequelize-cli`
- Delete the database and recreate if migration issues occur

### Performance

- PostgreSQL supports better indexing compared to MongoDB
- Consider adding indexes for frequently queried fields (category, completed, date)
- Use Sequelize query optimization features

## Next Steps (Optional)

1. **Implement Proper Migrations**: Use `sequelize-cli` for production environment

   ```bash
   npx sequelize-cli init
   npx sequelize-cli migration:create --name add-indexes
   ```

2. **Add Database Indexes**:

   ```javascript
   // Add to migration or model definition
   indexes: [
     { fields: ["completed"] },
     { fields: ["category"] },
     { fields: ["date"] },
   ];
   ```

3. **Backup Strategy**: Set up PostgreSQL backups for production deployments

4. **Connection Pooling**: Configure Sequelize connection pool for better performance

---

For more information about Sequelize, visit: https://sequelize.org/
