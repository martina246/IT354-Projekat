import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.post('/api/send-email', async (req, res) => {
    const { to, subject, htmlContent, textContent } = req.body;
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@helpdesk.com';

    if (!to || !subject || !htmlContent) {
        return res.status(400).json({ 
            error: 'Missing required fields: to, subject, htmlContent' 
        });
    }

    if (!SENDGRID_API_KEY) {
        console.warn('SendGrid API key not configured');
        return res.status(500).json({ 
            error: 'Email service not configured' 
        });
    }

    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: to }],
                }],
                from: { email: FROM_EMAIL },
                subject: subject,
                content: [
                    {
                        type: 'text/plain',
                        value: textContent || htmlContent.replace(/<[^>]*>/g, ''),
                    },
                    {
                        type: 'text/html',
                        value: htmlContent,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorDetails;
            try {
                errorDetails = JSON.parse(errorText);
            } catch {
                errorDetails = { message: errorText };
            }
            
            console.error('SendGrid API Error:', response.status);
            console.error('Error details:', JSON.stringify(errorDetails, null, 2));
            
            let userMessage = `SendGrid API Error: ${response.status}`;
            if (response.status === 403) {
                const errorMsg = errorDetails?.errors?.[0]?.message || 'Unknown 403 error';
                userMessage = `SendGrid 403 Forbidden: ${errorMsg}`;
                console.error('403 Error details:', errorMsg);
            } else if (response.status === 401) {
                userMessage = 'SendGrid 401 Unauthorized - API key is invalid or expired';
            } else if (response.status === 429) {
                userMessage = 'SendGrid 429 Rate Limit - Too many requests. Free tier allows 100 emails/day.';
            }
            
            return res.status(response.status).json({ 
                error: userMessage,
                details: errorDetails 
            });
        }

        console.log('Email sent successfully to:', to);
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to send email',
            details: error.message 
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'email-proxy' });
});

app.listen(PORT, () => {
    console.log(`Email proxy server running on http://localhost:${PORT}`);
    console.log(`SendGrid API Key configured: ${process.env.SENDGRID_API_KEY ? 'Yes' : 'No'}`);
});
