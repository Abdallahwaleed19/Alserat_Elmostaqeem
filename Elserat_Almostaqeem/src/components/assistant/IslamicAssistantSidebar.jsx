import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './IslamicAssistantSidebar.css';

const IslamicAssistantSidebar = () => {
    const { lang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const handleMouseEnter = () => {
        if (window.innerWidth >= 768) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 768) {
            setIsOpen(false);
        }
    };

    const handleAsk = async (e) => {
        e?.preventDefault();
        const trimmed = question.trim();
        if (!trimmed || loading) return;

        const userMessage = {
            role: 'user',
            content: trimmed,
            id: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setQuestion('');
        setLoading(true);

        try {
            // NOTE: This endpoint should be implemented on the backend
            // to answer from trusted Islamic sources (Quran, Sunnah, major scholars).
            const res = await fetch('/.netlify/functions/islamic-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: trimmed, history: messages }),
            });

            if (!res.ok) {
                throw new Error('Request failed');
            }

            const data = await res.json();

            const answerText =
                data?.answer ||
                (lang === 'ar'
                    ? 'تم استلام سؤالك، وسيتم الإجابة عليه من مصادر موثوقة عند تفعيل خدمة المساعد.'
                    : 'Your question has been received. The assistant will answer from trusted sources once the service is configured.');

            const assistantMessage = {
                role: 'assistant',
                content: answerText,
                sources: data?.sources || '',
                id: Date.now() + 1,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const fallback =
                lang === 'ar'
                    ? 'تعذّر الاتصال بالمساعد الآن. تأكد من إعداد واجهة /api/islamic-assistant وربطها بمصادر موثوقة (القرآن، السنة الصحيحة، وفتاوى العلماء الراسخين).'
                    : 'Unable to reach the assistant. Please configure /api/islamic-assistant to answer from authentic sources (Quran, authentic Sunnah, and reliable scholars).';

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: fallback,
                    id: Date.now() + 1,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const title = lang === 'ar' ? 'المساعد الشرعي' : 'Islamic Assistant';
    const subtitle =
        lang === 'ar'
            ? 'اسأل عن الأحكام والعبادات والعقيدة من مصادر موثوقة.'
            : 'Ask about fiqh, worship, and creed from trusted sources.';

    const placeholder =
        lang === 'ar'
            ? 'اكتب سؤالك هنا (مثال: ما حكم الجمع بين الصلوات؟)'
            : 'Type your question here (e.g. ruling on combining prayers?)';

    const sendLabel = lang === 'ar' ? 'إرسال' : 'Send';

    return (
        <div
            className={`islamic-assistant-wrapper ${isOpen ? 'open' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                type="button"
                className="assistant-tab"
                onClick={toggleOpen}
                aria-label={title}
            >
                <MessageCircle className="assistant-tab-icon" size={22} />
                <span className="assistant-tab-text">
                    {lang === 'ar' ? 'اسأل المساعد' : 'Ask assistant'}
                </span>
            </button>

            <div className="assistant-panel">
                <div className="assistant-header">
                    <div>
                        <h3 className="assistant-title">{title}</h3>
                        <p className="assistant-subtitle">{subtitle}</p>
                    </div>
                    <button
                        type="button"
                        className="assistant-close-btn"
                        onClick={toggleOpen}
                        aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="assistant-body">
                    {messages.length === 0 && (
                        <div className="assistant-empty">
                            {lang === 'ar'
                                ? 'ابدأ بسؤال عن حكم فقهي، أو كيفية عبادة، أو تفسير آية، وسيتم الإجابة عليك من خلال المراجع الموثوقة عند ربط المساعد بالخادم.'
                                : 'Start by asking about a fiqh ruling, a worship question, or a Quran verse. Answers will come from authentic sources once the assistant backend is configured.'}
                        </div>
                    )}

                    {messages.length > 0 && (
                        <div className="assistant-messages">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`assistant-message assistant-message-${msg.role}`}
                                >
                                    <div className="assistant-message-bubble">
                                        <div className="assistant-message-text">{msg.content}</div>
                                        {msg.sources && (
                                            <div className="assistant-message-sources">
                                                <strong>{lang === 'ar' ? 'المصدر:' : 'Source:'}</strong> {msg.sources}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <form className="assistant-input-row" onSubmit={handleAsk}>
                    <textarea
                        className="assistant-input"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={placeholder}
                        rows={2}
                    />
                    <button
                        type="submit"
                        className="assistant-send-btn"
                        disabled={loading || !question.trim()}
                    >
                        <Send size={18} />
                        <span>{loading ? (lang === 'ar' ? 'جارٍ...' : 'Sending...') : sendLabel}</span>
                    </button>
                </form>

                <p className="assistant-disclaimer">
                    {lang === 'ar'
                        ? 'تنبيه مهم: يجب التأكد من أن الخادم الخلفي للمساعد مربوط بمصادر شرعية موثوقة، وأن الإجابات يتم مراجعتها من أهل العلم.'
                        : 'Important: The assistant backend must be connected to authentic Islamic sources, and answers should be reviewed by qualified scholars.'}
                </p>
            </div>
        </div>
    );
};

export default IslamicAssistantSidebar;

