import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';

const app = createApp();

describe('Freelance Copilot AI Endpoints', () => {
    let authToken = '';
    let userId = '';

    beforeAll(async () => {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freelance_os_test';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(mongoUri);
        }

        const reg = await request(app).post('/api/auth/register').send({
            name: 'AI Tester',
            email: `test-ai-${Date.now()}@freelanceos.dev`,
            password: 'password123',
        });

        authToken = reg.body.data.token;
        userId = reg.body.data.user._id;
    });

    afterAll(async () => {
        if (userId) {
            await User.findByIdAndDelete(userId);
        }
        await mongoose.connection.close();
    });

    it('should generate structured proposal via AI service', async () => {
        const res = await request(app)
            .post('/api/ai/proposal')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                clientName: 'Acme Corp',
                projectDescription: 'Build modern AI CRM platform',
                services: ['Frontend React', 'Node.js Backend'],
                budget: 5000,
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBeDefined();
        expect(res.body.data.deliverables.length).toBeGreaterThan(0);
        expect(res.body.data.services.length).toBeGreaterThan(0);
    });

    it('should generate prioritized task recommendations', async () => {
        const res = await request(app)
            .post('/api/ai/prioritize-tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                tasks: [
                    { id: '1', title: 'Critical Bugfix', priority: 'urgent', status: 'in_progress', estimatedHours: 2 },
                    { id: '2', title: 'Update Footer Link', priority: 'low', status: 'todo', estimatedHours: 1 },
                ],
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.recommendations).toBeDefined();
        expect(res.body.data.recommendations[0].taskId).toBe('1');
    });
});
