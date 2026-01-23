
const EMAIL_API_URL = 'http://localhost:3002/api/send-email';

interface EmailOptions {
    to: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
}


export async function sendEmail({ to, subject, htmlContent, textContent }: EmailOptions): Promise<void> {
    try {
        const response = await fetch(EMAIL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to,
                subject,
                htmlContent,
                textContent,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Email API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        console.log('Email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


export async function sendTicketCreatedEmail(
    userEmail: string,
    userName: string,
    ticketTitle: string,
    ticketId: string
): Promise<void> {
    const subject = `New Ticket Created: ${ticketTitle}`;
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #646cff;">Ticket Created Successfully</h2>
            <p>Hello ${userName},</p>
            <p>Your ticket has been created successfully!</p>
            <div style="background-color: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <p><strong>Ticket ID:</strong> #${ticketId}</p>
                <p><strong>Title:</strong> ${ticketTitle}</p>
                <p><strong>Status:</strong> Open</p>
            </div>
            <p>We'll notify you when there are updates to your ticket.</p>
            <p style="color: #666; font-size: 0.875rem; margin-top: 2rem;">
                This is an automated message from Help Desk System.
            </p>
        </div>
    `;

    await sendEmail({
        to: userEmail,
        subject,
        htmlContent,
    });
}

export async function sendTicketStatusUpdateEmail(
    userEmail: string,
    userName: string,
    ticketTitle: string,
    ticketId: string,
    oldStatus: string,
    newStatus: string
): Promise<void> {
    const statusLabels: Record<string, string> = {
        'open': 'Open',
        'in_progress': 'In progress',
        'closed': 'Closed',
    };

    const statusColors: Record<string, string> = {
        'open': '#ff6b6b',
        'in_progress': '#4ecdc4',
        'closed': '#95e1d3',
    };

    const subject = `Ticket Status Updated: ${ticketTitle}`;
    const htmlContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #646cff;">Ticket Status Updated</h2>
            <p>Hello ${userName},</p>
            <p>Your ticket status has been updated:</p>
            <div style="background-color: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <p><strong>Ticket ID:</strong> #${ticketId}</p>
                <p><strong>Title:</strong> ${ticketTitle}</p>
                <p>
                    <strong>Status:</strong> 
                    <span style="color: ${statusColors[newStatus]}; font-weight: bold;">
                        ${statusLabels[oldStatus]} → ${statusLabels[newStatus]}
                    </span>
                </p>
            </div>
            <p>You can view your ticket details in the Help Desk dashboard.</p>
            <p style="color: #666; font-size: 0.875rem; margin-top: 2rem;">
                This is an automated message from Help Desk System.
            </p>
        </div>
    `;

    await sendEmail({
        to: userEmail,
        subject,
        htmlContent
    });


}