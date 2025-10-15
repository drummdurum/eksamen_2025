import 'dotenv/config';

// Alternative email service using HTTP instead of SMTP
export async function sendMailViaHTTP(email, subject, text) {
    console.log('Attempting HTTP-based email sending...');
    
    try {
        // For Railway production - log email details for manual verification
        // This allows you to see the password reset links in the logs
        console.log('=== EMAIL FALLBACK - MANUAL VERIFICATION ===');
        console.log('To:', email);
        console.log('Subject:', subject);
        console.log('Content:', text);
        console.log('Timestamp:', new Date().toISOString());
        console.log('=== END EMAIL CONTENT ===');
        
        // Extract reset link from text if it exists
        const resetLinkMatch = text.match(/(https?:\/\/[^\s]+)/);
        if (resetLinkMatch) {
            console.log('IMPORTANT - Password Reset Link:', resetLinkMatch[0]);
        }
        
        // In production, you would make an HTTP request to your email service here
        // Example with fetch to a service like SendGrid, Mailgun, etc.
        /*
        const response = await fetch('https://api.emailservice.com/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({
                to: email,
                subject: subject,
                text: text,
                from: 'sedrumm@gmail.com'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        */
        
        return {
            success: true,
            messageId: 'fallback-' + Date.now(),
            method: 'logging_fallback',
            note: 'Email logged to console for manual verification'
        };
        
    } catch (error) {
        console.error('HTTP email sending failed:', error);
        throw error;
    }
}