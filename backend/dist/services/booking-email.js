import nodemailer from 'nodemailer';
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character] ?? character);
export async function sendBookingNotification(booking) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const recipient = process.env.NAVIN_EMAIL;
    if (!host || !user || !pass || !recipient) {
        throw new Error('SMTP_HOST, SMTP_USER, SMTP_PASS, and NAVIN_EMAIL must be configured');
    }
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    const date = booking.preferredDate.toLocaleDateString('en-IN', { dateStyle: 'long', timeZone: 'Asia/Kolkata' });
    const modules = booking.selectedModules.map((module) => `<li style="margin:0 0 8px">${escapeHtml(module)}</li>`).join('');
    await transporter.sendMail({
        from: process.env.SMTP_FROM ?? `Navin Kawal Bookings <${user}>`,
        to: recipient,
        replyTo: booking.email,
        subject: `New institutional booking query from ${booking.institutionName}`,
        text: `New booking query from ${booking.contactPerson} at ${booking.institutionName}. Preferred date: ${date}. Modules: ${booking.selectedModules.join(', ')}.`,
        html: `<div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:32px;color:#172033"><div style="max-width:620px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(23,32,51,.08)"><div style="background:#102a43;padding:28px 32px;color:#fff"><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#a8d5e5">Navin Kawal</div><h1 style="margin:8px 0 0;font-size:24px">New booking query</h1></div><div style="padding:32px"><p style="font-size:16px;line-height:1.6">A new institutional course enquiry has been submitted.</p><table style="width:100%;border-collapse:collapse;font-size:14px"><tr><td style="padding:10px 0;color:#667085">Institution</td><td style="padding:10px 0;font-weight:bold">${escapeHtml(booking.institutionName)}</td></tr><tr><td style="padding:10px 0;color:#667085">Contact person</td><td style="padding:10px 0;font-weight:bold">${escapeHtml(booking.contactPerson)}</td></tr><tr><td style="padding:10px 0;color:#667085">Email</td><td style="padding:10px 0"><a href="mailto:${escapeHtml(booking.email)}">${escapeHtml(booking.email)}</a></td></tr><tr><td style="padding:10px 0;color:#667085">Phone</td><td style="padding:10px 0">${escapeHtml(booking.phone)}</td></tr><tr><td style="padding:10px 0;color:#667085">Audience</td><td style="padding:10px 0">${escapeHtml(booking.expectedAudience)}</td></tr><tr><td style="padding:10px 0;color:#667085">Preferred date</td><td style="padding:10px 0;font-weight:bold">${date}</td></tr></table><h2 style="font-size:16px;margin:26px 0 10px">Selected modules</h2><ul style="padding-left:20px;line-height:1.5">${modules}</ul></div></div></div>`,
    });
}
