import { z } from 'zod';
import { COURSE_MODULES } from '../config/modules.js';
const futureDate = z.coerce.date().refine((date) => date >= new Date(), {
    message: 'Preferred date must be today or a future date',
});
export const bookingSchema = z.object({
    institutionName: z.string().trim().min(2).max(200),
    contactPerson: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(7).max(30).regex(/^[+\d\s().-]+$/, 'Enter a valid phone number'),
    expectedAudience: z.string().trim().min(2).max(500),
    preferredDate: futureDate,
    selectedModules: z.array(z.enum(COURSE_MODULES)).min(1).max(8),
});
