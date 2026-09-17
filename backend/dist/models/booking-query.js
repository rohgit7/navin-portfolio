import mongoose from 'mongoose';
import { COURSE_MODULES } from '../config/modules.js';
const bookingQuerySchema = new mongoose.Schema({
    institutionName: { type: String, required: true, trim: true, maxlength: 200 },
    contactPerson: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    expectedAudience: { type: String, required: true, trim: true, maxlength: 500 },
    preferredDate: { type: Date, required: true },
    selectedModules: {
        type: [{ type: String, enum: COURSE_MODULES }],
        required: true,
        validate: {
            validator: (modules) => modules.length > 0 && modules.length <= 8,
            message: 'Select between 1 and 8 modules',
        },
    },
}, { timestamps: true, versionKey: false });
export const BookingQueryModel = mongoose.model('BookingQuery', bookingQuerySchema);
