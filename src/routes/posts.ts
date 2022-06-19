import { FastifyPluginAsync } from 'fastify';
import {
    createPost,
    deletePost,
    getAllPosts,
    getPostById,
    updatePost,
} from '../handlers/posts.handler';

const posts: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    fastify.get('/posts', getAllPosts);

    fastify.get('/posts/:id', getPostById);

    fastify.post('/posts', { onRequest: [fastify.jwtauthenticate] }, createPost);

    fastify.put('/posts/:id', { onRequest: [fastify.jwtauthenticate] }, updatePost);

    fastify.delete('/posts/:id', { onRequest: [fastify.jwtauthenticate] }, deletePost);

};

export default posts;