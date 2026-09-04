import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';

const app = createApp();

describe('Auth API Endpoints', () => {
    beforeAll(async () => {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freelance_os_test';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(mongoUri);
        }
    });

    afterAll(async () => {
        await User.deleteMany({ email: /test-auth-.*@freelanceos\.dev/ });
        await mongoose.connection.close();
    });

    const testEmail = `test-auth-${Date.now()}@freelanceos.dev`;
    let authToken = '';

    it('should register a new freelancer account', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test Freelancer',
                email: testEmail,
                password: 'securePassword123',
                hourlyRate: 85,
                currency: 'USD',
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.user.email).toBe(testEmail);
        expect(res.body.data.token).toBeDefined();
        authToken = res.body.data.token;
    });

    it('should reject registration with existing email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Duplicate Freelancer',
                email: testEmail,
                password: 'securePassword123',
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should login with valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: 'securePassword123',
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: 'wrongPassword999',
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('should fetch user profile with bearer token', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(testEmail);
    });
});
