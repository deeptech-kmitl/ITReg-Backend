// register.test.js
const request = require('supertest');
const app = require('../server');

// describe('POST /newPost', () => {
//     it('creates a new post', async () => {
//         const response = await request(app)
//             .post('/newPost')
//             .field('titlename', 'TestTitle')
//             .field('name', 'TestName')
//             .field('message', 'TestMessage')

//         expect(response.statusCode).toBe(201);

//     });
// });

// describe('GET /post', () => {
//     it('retrieves posts with comments', async () => {
//         const response = await request(app)
//             .get('/post');

//         expect(response.statusCode).toBe(201);
//         expect(response.body).toBeInstanceOf(Array);
//         expect(response.body.length).toBeGreaterThan(0);
//         const post = response.body[0];
//         expect(post).toHaveProperty('id');
//         expect(post).toHaveProperty('titlename');
//         expect(post).toHaveProperty('name');
//         expect(post).toHaveProperty('message');
//         expect(post).toHaveProperty('comments');
//     });
// });

describe('PUT /editPost/:postId', () => {
    it('edits an existing post', async () => {
        const postId = 'your-post-id-here';
        const response = await request(app)
            .put(`/editPost/${postId}`)
            .send({ Title: 'Updated Title', message: 'Updated Message' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', postId);
        expect(response.body).toHaveProperty('titlename', 'Updated Title');
        expect(response.body).toHaveProperty('message', 'Updated Message');
    });
});

// describe('DELETE /deletePost/:postId', () => {
//     it('deletes an existing post', async () => {
//         const postId = 'your-post-id-here';
//         const response = await request(app)
//             .delete(`/deletePost/${postId}`);

//         expect(response.statusCode).toBe(200);
//         expect(response.body).toHaveProperty('message', 'Post deleted successfully');
//     });
// });

// describe('POST /newcommentPost', () => {
//     it('adds a new comment to a post', async () => {
//         const postId = 'your-post-id-here';
//         const response = await request(app)
//             .post('/newcommentPost')
//             .send({ postId, detail: 'Test Comment', userId: 'test-user-id' });

//         expect(response.statusCode).toBe(201);
//         expect(response.body).toHaveProperty('commentId');
//         expect(response.body).toHaveProperty('detail', 'Test Comment');
//         expect(response.body).toHaveProperty('userId', 'test-user-id');
//     });
// });

// describe('DELETE /delCommentPost/:postId/:commentId', () => {
//     it('deletes a comment from a post', async () => {
//         const postId = 'your-post-id-here';
//         const commentId = 'your-comment-id-here';
//         const response = await request(app)
//             .delete(`/delCommentPost/${postId}/${commentId}`);

//         expect(response.statusCode).toBe(200);
//         expect(response.text).toBe('delete success');
//     });
// });

// describe('PUT /newPostLikes', () => {
//     it('adds a new like to a post', async () => {
//         const response = await request(app)
//             .put('/newPostLikes')
//             .send({ postId: 'your-post-id-here', userId: 'test-user-id' });

//         expect(response.statusCode).toBe(201);
//         expect(response.body).toHaveProperty('message', 'seccess');
//     });
// });

// describe('PUT /delPostLikes', () => {
//     it('deletes a like from a post', async () => {
//         const response = await request(app)
//             .put('/delPostLikes')
//             .send({ postId: 'your-post-id-here', userId: 'test-user-id' });

//         expect(response.statusCode).toBe(201);
//         expect(response.body).toHaveProperty('message', 'seccess');
//     });
// });
