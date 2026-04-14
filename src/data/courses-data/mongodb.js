export const mongodbCourse = {
  id: 'mongodb',
  title: 'MongoDB',
  description: 'NoSQL Document Database used for high volume data storage.',
  icon: 'Database',
  category: 'Databases',
  sections: [
    {
      id: 'mongodb-intro',
      title: 'Introduction to MongoDB',
      content: `MongoDB is a highly scalable, flexible NoSQL document database. Instead of traditional tables and rows, MongoDB makes use of collections and documents. Documents are composed of key-value pairs (BSON).`,
      image: '/images/courses/database_visualization_1776183767809.png'
    },
    {
      id: 'mongodb-setup',
      title: 'Installation & Setup',
      content: `### Local Installation
Download the MongoDB Community Server and MongoDB Compass (GUI) from their website. Install and set up MongoDB to run as a background service on standard port 27017.

### Example URI Configuration
\`\`\`text
mongodb://localhost:27017/my_database
\`\`\`

Alternatively, you can manage cloud clusters via **MongoDB Atlas** avoiding local installations.`
    },
    {
      id: 'mongodb-crud',
      title: 'Basic CRUD Operations (Mongosh / Shell)',
      content: `### Insert
\`\`\`javascript
db.users.insertOne({ name: "Alice", age: 25, status: "active" })
\`\`\`

### Find (Query)
\`\`\`javascript
db.users.find({ age: { $gt: 18 } })
\`\`\`

### Update
\`\`\`javascript
db.users.updateOne({ name: "Alice" }, { $set: { status: "inactive" } })
\`\`\`

### Delete
\`\`\`javascript
db.users.deleteOne({ name: "Alice" })
\`\`\``
    },
    {
      id: 'mongodb-code',
      title: 'Node.js (Mongoose) Integration',
      content: `### Example Usage
\`\`\`javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_database');

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const User = mongoose.model('User', UserSchema);

async function createUser() {
    const user = new User({ name: 'Bob', age: 30 });
    await user.save();
    console.log("User Saved!");
}
createUser();
\`\`\``
    },
    {
      id: 'mongodb-indexes',
      title: 'Configuration & Best Practices',
      content: `### Indexing
Ensure your collections are properly indexed to avoid full collection scans.
\`\`\`javascript
db.users.createIndex({ "name": 1 }) // Ascending index
\`\`\`

### Schema Design Options
- **Embedding:** Embedding related data in the main document (increases nested performance).
- **Referencing:** Referencing IDs of other collections (better for many-to-many or unbounded arrays).`
    }
  ]
};
