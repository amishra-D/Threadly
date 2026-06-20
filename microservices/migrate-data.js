const mongoose = require('mongoose');

const SOURCE_URI = 'mongodb+srv://anshumishraocog:Lr05IYITt1KJre9f@threadly.vysu5b9.mongodb.net/test'; // Monolith DB
const AUTH_URI = 'mongodb+srv://anshumishraocog:Lr05IYITt1KJre9f@threadly.vysu5b9.mongodb.net/threadly_auth';
const USER_URI = 'mongodb+srv://anshumishraocog:Lr05IYITt1KJre9f@threadly.vysu5b9.mongodb.net/threadly_user';
const CONTENT_URI = 'mongodb+srv://anshumishraocog:Lr05IYITt1KJre9f@threadly.vysu5b9.mongodb.net/threadly_content';
const INTERACTION_URI = 'mongodb+srv://anshumishraocog:Lr05IYITt1KJre9f@threadly.vysu5b9.mongodb.net/threadly_interaction';
const MOD_URI = 'mongodb+srv://anshumishraocog:Lr05IYITt1KJre9f@threadly.vysu5b9.mongodb.net/threadly_moderation';

async function migrate() {
    try {
        console.log("Connecting to Source DB...");
        const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
        console.log("Connected to Source DB");

        const authConn = await mongoose.createConnection(AUTH_URI).asPromise();
        const userConn = await mongoose.createConnection(USER_URI).asPromise();
        const contentConn = await mongoose.createConnection(CONTENT_URI).asPromise();
        const interactionConn = await mongoose.createConnection(INTERACTION_URI).asPromise();
        const modConn = await mongoose.createConnection(MOD_URI).asPromise();
        console.log("Connected to all Target DBs");

        // Source Collections
        const sourceUsers = sourceConn.collection('users');
        const sourcePosts = sourceConn.collection('posts');
        const sourceComments = sourceConn.collection('comments');
        const sourceBoards = sourceConn.collection('boards');
        const sourceReports = sourceConn.collection('reports');

        // Target Collections
        const targetAuths = authConn.collection('auths');
        const targetProfiles = userConn.collection('profiles');
        const targetPosts = contentConn.collection('posts');
        const targetBoards = contentConn.collection('boards');
        const targetComments = interactionConn.collection('comments');
        const targetReports = modConn.collection('reports');

        console.log("Clearing target collections to prevent duplicates...");
        await targetAuths.deleteMany({});
        await targetProfiles.deleteMany({});
        await targetPosts.deleteMany({});
        await targetBoards.deleteMany({});
        await targetComments.deleteMany({});
        await targetReports.deleteMany({});

        // 1. Migrate Users
        console.log("Migrating Users...");
        const users = await sourceUsers.find({}).toArray();
        if (users.length > 0) {
            const authDocs = users.map(u => ({
                _id: u._id,
                username: u.username,
                email: u.email,
                passwordHash: u.passwordHash,
                isVerified: u.isVerified,
                isAdmin: u.isAdmin,
                otp: u.otp,
                createdAt: u.createdAt
            }));

            const profileDocs = users.map(u => ({
                _id: u._id,
                authId: u._id, // Explicitly map
                username: u.username,
                email: u.email,
                pfp: u.pfp,
                bio: u.bio,
                location: u.location,
                banner: u.banner,
                bookmarks: u.bookmarks ? u.bookmarks.map(b => b.toString()) : [],
                createdAt: u.createdAt
            }));

            await targetAuths.insertMany(authDocs);
            await targetProfiles.insertMany(profileDocs);
            console.log(`Migrated ${users.length} users to Auth and Profile services`);
        }

        // 2. Migrate Boards
        console.log("Migrating Boards...");
        const boards = await sourceBoards.find({}).toArray();
        if (boards.length > 0) {
            await targetBoards.insertMany(boards);
            console.log(`Migrated ${boards.length} boards`);
        }

        // 3. Migrate Posts
        console.log("Migrating Posts...");
        const posts = await sourcePosts.find({}).toArray();
        if (posts.length > 0) {
            const postDocs = posts.map(p => {
                // Rename userId if it was named something else, Monolith has 'userId' according to schema!
                return {
                    ...p,
                    userId: p.userId ? p.userId.toString() : p.userId,
                    likes: p.likes ? p.likes.map(l => l.toString()) : [],
                    dislikes: p.dislikes ? p.dislikes.map(d => d.toString()) : []
                };
            });
            await targetPosts.insertMany(postDocs);
            console.log(`Migrated ${posts.length} posts`);
        }

        // 4. Migrate Comments
        console.log("Migrating Comments...");
        const comments = await sourceComments.find({}).toArray();
        if (comments.length > 0) {
            const commentDocs = comments.map(c => {
                return {
                    ...c,
                    userId: c.userId ? c.userId.toString() : c.userId,
                    postId: c.postId ? c.postId.toString() : c.postId,
                    parentCommentId: c.parentCommentId ? c.parentCommentId.toString() : c.parentCommentId,
                    likes: c.likes ? c.likes.map(l => l.toString()) : [],
                    dislikes: c.dislikes ? c.dislikes.map(d => d.toString()) : []
                };
            });
            await targetComments.insertMany(commentDocs);
            console.log(`Migrated ${comments.length} comments`);
        }

        // 5. Migrate Reports
        console.log("Migrating Reports...");
        const reports = await sourceReports.find({}).toArray();
        if (reports.length > 0) {
            await targetReports.insertMany(reports);
            console.log(`Migrated ${reports.length} reports`);
        }

        console.log("Migration Complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
