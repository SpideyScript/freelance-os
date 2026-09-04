import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Client } from '../src/models/Client.js';
import { Invoice } from '../src/models/Invoice.js';

const app = createApp();

describe('Invoice Calculations and Lifecycle API', () => {
    let authToken = '';
    let userId = '';
    let clientId = '';

    beforeAll(async () => {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freelance_os_test';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(mongoUri);
        }

        const reg = await request(app).post('/api/auth/register').send({
            name: 'Invoice Tester',
            email: `test-invoice-${Date.now()}@freelanceos.dev`,
            password: 'password123',
        });

        authToken = reg.body.data.token;
        userId = reg.body.data.user._id;

        const clientRes = await request(app)
            .post('/api/clients')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Invoice Test Client Inc',
                email: 'billing@testclient.com',
                status: 'active',
            });

        clientId = clientRes.body.data._id;
    });

    afterAll(async () => {
        if (userId) {
            await User.findByIdAndDelete(userId);
            await Client.deleteMany({ userId });
            await Invoice.deleteMany({ userId });
        }
        await mongoose.connection.close();
    });

    it('should correctly calculate subtotal, tax, discount, and total for invoice', async () => {
        const res = await request(app)
            .post('/api/invoices')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                clientId,
                invoiceNumber: `INV-TEST-${Date.now()}`,
                dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
                items: [
                    { description: 'Full Stack App Development', quantity: 10, rate: 100, amount: 1000 },
                    { description: 'API Integration', quantity: 5, rate: 100, amount: 500 },
                ],
                discountAmount: 100,
                taxRate: 10,
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.subtotal).toBe(1500);
        expect(res.body.data.discountAmount).toBe(100);
        expect(res.body.data.taxAmount).toBe(140);
        expect(res.body.data.total).toBe(1540);
    });
});
