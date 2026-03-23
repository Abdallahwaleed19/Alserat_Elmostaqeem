import React from 'react';
import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import '../Terms/Terms.css'; // Reusing Terms CSS for consistent layout

const Privacy = () => {
    const { lang } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <div className="terms-container page-container fade-in">
            <div className="terms-header">
                <Shield className="terms-icon" size={48} />
                <h1 className="terms-title">
                    {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </h1>
                <p className="terms-subtitle">
                    {lang === 'ar' ? 'نحن نحترم خصوصيتك ونحمي بياناتك' : 'We respect your privacy and protect your data'}
                </p>
            </div>

            <div className="terms-content">
                <section className="terms-section">
                    <h2 className="section-title">
                        <Lock size={24} />
                        {lang === 'ar' ? '1. جمع البيانات' : '1. Data Collection'}
                    </h2>
                    <p className="section-text text-arabic">
                        {lang === 'ar' ? (
                            <>
                                تطبيق <strong>"الصراط المستقيم"</strong> لا يقوم بجمع أي بيانات شخصية أو معلومات تعريفية عن المستخدمين. 
                                جميع البيانات المتعلقة بـ (الأذكار، العلامات المرجعية، تقدم الورد اليومي) يتم حفظها <strong>محلياً فقط (Local Storage)</strong> على جهازك ولن يتم إرسالها إلى أي خوادم خارجية.
                            </>
                        ) : (
                            <>
                                The <strong>"As-Sirat Al-Mustaqeem" (Zad El-Muslim)</strong> app does not collect any personal or identifiable information about its users. 
                                All data related to (Adhkar, Bookmarks, Daily Planner progress) is saved <strong>locally only (Local Storage)</strong> on your device and is never sent to any external servers.
                            </>
                        )}
                    </p>
                </section>

                <section className="terms-section">
                    <h2 className="section-title">
                        <FileText size={24} />
                        {lang === 'ar' ? '2. صلاحيات الموقع الجغرافي' : '2. Location Permissions'}
                    </h2>
                    <p className="section-text text-arabic">
                        {lang === 'ar' ? (
                            <>
                                نطلب صلاحية الوصول إلى الموقع الجغرافي <strong>فقط</strong> من أجل حساب مواقيت الصلاة بدقة بناءً على موقعك الحالي. لا يتم تتبع موقعك أو تخزينه أو مشاركته مع أي طرف ثالث تحت أي ظرف.
                            </>
                        ) : (
                            <>
                                We request location access <strong>only</strong> to accurately calculate prayer times based on your current location. Your location is never tracked, stored, or shared with any third party under any circumstances.
                            </>
                        )}
                    </p>
                </section>

                <section className="terms-section">
                    <h2 className="section-title">
                        <CheckCircle size={24} />
                        {lang === 'ar' ? '3. أمن البيانات والاستخدام' : '3. Data Security & Usage'}
                    </h2>
                    <p className="section-text text-arabic">
                        {lang === 'ar' ? (
                            <>
                                تم تصميم هذا التطبيق ليكون رفيقاً آمناً للمسلم. نحن نلتزم بعدم استخدام أي أدوات تتبع خفية أو بيع بياناتك لأي معلنين، ولا نرسل أي رسائل أو إشعارات مزعجة دون موافقتك الصريحة المتعلقة بمواعيد الأذان.
                            </>
                        ) : (
                            <>
                                This app is designed to be a safe companion for Muslims. We are committed to never using hidden trackers or selling your data to advertisers, and we do not send spam notifications without your explicit consent regarding Adhan times.
                            </>
                        )}
                    </p>
                </section>
            </div>

            <div className="terms-footer">
                <p>
                    {lang === 'ar' ? '© ' + currentYear + ' مشروع الصراط المستقيم. جميع الحقوق محفوظة.' : '© ' + currentYear + ' As-Sirat Al-Mustaqeem Project. All rights reserved.'}
                </p>
            </div>
        </div>
    );
};

export default Privacy;
