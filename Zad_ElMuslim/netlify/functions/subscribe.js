import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Handle CORS for local dev or different origins if needed
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { subscription, latitude, longitude, timeZone } = JSON.parse(event.body);

        if (!subscription || !subscription.endpoint) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'subscription required' }),
            };
        }

        if (!supabaseUrl || !supabaseKey) {
            console.error("Missing Supabase credentials");
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Database not configured properly' })
            }
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Upsert the subscription
        const { error } = await supabase
            .from('subscriptions')
            .upsert({
                endpoint: subscription.endpoint,
                subscription: subscription,
                latitude: latitude ?? 30.0444,
                longitude: longitude ?? 31.2357,
                time_zone: timeZone || 'Africa/Cairo',
            });

        if (error) {
            console.error('Error inserting subscription:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to save subscription' }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ ok: true }),
        };
    } catch (error) {
        console.error('Error processing subscribe request:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
