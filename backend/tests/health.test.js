const request = require('supertest');
const express = require('express');
const app = express();

// Simple health check route for testing
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('Health Check', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ status: 'ok' });
    });
});
