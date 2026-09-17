import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { BookingQueryModel } from './models/booking-query.js';
import { sendBookingNotification } from './services/booking-email.js';
import { bookingSchema } from './validation/booking.js';
const app = express();
const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/navin_kawal';
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ?? true }));
app.use(express.json({ limit: '32kb' }));
app.get('/health', (_request, response) => {
    response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});
app.post('/api/bookings', async (request, response) => {
    const result = bookingSchema.safeParse(request.body);
    if (!result.success) {
        response.status(400).json({ error: 'Validation failed', fields: result.error.flatten().fieldErrors });
        return;
    }
    try {
        const booking = await BookingQueryModel.create(result.data);
        await sendBookingNotification(result.data);
        response.status(201).json({ message: 'Booking query submitted successfully', bookingId: booking.id });
    }
    catch (error) {
        console.error('[booking-submission]', error);
        response.status(500).json({ error: 'Unable to submit booking query. Please try again.' });
    }
});
app.use((_request, response) => response.status(404).json({ error: 'Route not found' }));
async function start() {
    await mongoose.connect(mongoUri);
    app.listen(port, () => console.log(`Booking API listening on port ${port}`));
}
start().catch((error) => {
    console.error('[startup]', error);
    process.exit(1);
});
async function shutdown(signal) {
    console.log(`[shutdown] ${signal}`);
    await mongoose.disconnect();
    process.exit(0);
}
process.once('SIGTERM', () => void shutdown('SIGTERM'));
process.once('SIGINT', () => void shutdown('SIGINT'));
