export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST',
            },
            body: '',
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    try {
        const body = JSON.parse(event.body || '{}');
        const question = (body.question || '').trim();

        if (!question) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'question is required' }),
            };
        }

        const answer =
            'المساعد الشرعي في هذا التطبيق حاليًا تجريبي، ويهدف إلى توجيهك للرجوع إلى القرآن الكريم، والسنة الصحيحة، وفتاوى العلماء الثقات، ولا يُعتَمد عليه وحده في الفتوى.' +
            '\n\n' +
            'توجيهات عامة:\n' +
            '1- لفهم الآيات، ارجع لتفاسير معتمدة مثل: تفسير السعدي، وابن كثير، والطبري.\n' +
            '2- في الأحكام العملية (الصلاة، الصيام، المعاملات...) فالأَولى سؤال دار الإفتاء في بلدك أو عالم موثوق بالعقيدة والعلم.\n' +
            '3- اجعل التطبيقات والذكاء الاصطناعي وسيلة مساعدة فقط، لا مصدرًا مستقلًا للفتوى.' +
            '\n\n' +
            'سؤالك كان:\n"' +
            question +
            '"\n\n' +
            'أنصحك بكتابته كما هو في موقع دار الإفتاء أو اللجنة الدائمة أو موقع إسلام ويب في باب الفتاوى، وقراءة الجواب كاملاً مع الأدلة.';

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ answer }),
        };
    } catch (error) {
        console.error('islamic-assistant error', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };

    try {
        const body = JSON.parse(event.body || '{}');
        const question = (body.question || '').trim();

        if (!question) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'question is required' }),
            };
        }

        const answer =
            'المساعد الشرعي في التطبيق حاليًا تجريبي، ويهدف لتوجيهك إلى الرجوع إلى القرآن الكريم، والسنة الصحيحة، وفتاوى العلماء الثقات.' +
            '\n\n' +
            'نصيحة عامة: \n' +
            '1- استعن بتفسير معتمد (مثل: تفسير السعدي أو ابن كثير) لفهم الآيات.\n' +
            '2- في المسائل الفقهية التفصيلية، ارجع لدار الإفتاء في بلدك أو لعلماء معروفين بالعلم والاعتدال.\n' +
            '3- لا تعتمد على التطبيقات أو الذكاء الاصطناعي وحده في الفتوى؛ بل اجعله فقط وسيلة مساعدة للوصول للمصادر.' +
            '\n\n' +
            'سؤالك كان: "' +
            question +
            '"\n\n' +
            'لإجابة مفصّلة ومسؤولة شرعًا، يُستحسن عرض هذا السؤال على عالم موثوق، أو الرجوع لمنصات الإفتاء الرسمية.';

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ answer }),
        };
    } catch (error) {
        console.error('islamic-assistant error', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

