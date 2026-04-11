import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const Token = process.env.RESEND_TOKEN;
const resend = new Resend(Token);

export async function POST(req: NextRequest) {
    const { name, lastName, phone, message } = await req.json();

    console.log('[RESEND] Token present:', !!Token);

    try {
        const { data, error } = await resend.emails.send({
            from: 'Portfolio Ana <onboarding@resend.dev>',
            to: 'anaartista122@gmail.com',
            subject: 'Portfolio Ana - New message from contact form',
            text: `
                Name: ${name}
                Last Name: ${lastName}
                Phone: ${phone}
                
                Message: ${message}
            `
        });

        if (error) {
            console.error('[RESEND] API error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('[RESEND] Sent OK:', data);
        return NextResponse.json({ message: 'Form submitted successfully' }, { status: 200 });
    } catch (error) {
        console.error('[RESEND] Exception:', error);
        return NextResponse.json({ error: 'Error sending form' }, { status: 500 });
    }
}
