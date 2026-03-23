import React from 'react';
import { Shield, FileText, AlertCircle, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './Terms.css';

const Terms = () => {
    const { lang } = useLanguage();

    const currentYear = new Date().getFullYear();

    return (
        <div className="terms-container page-container fade-in">
            <div className="terms-header">
                <Shield className="terms-icon" size={48} />
                <h1 className="terms-title">
                    {lang === 'ar' ? 'سياسة الاستخدام وحقوق النشر' : 'Terms of Use & Copyright'}
                </h1>
                <p className="terms-subtitle">
                    {lang === 'ar' ? 'هذا المشروع محمي بموجب حقوق الملكية الفكرية' : 'This project is protected by intellectual property rights'}
                </p>
            </div>

            <div className="terms-content">
                <section className="terms-section">
                    <h2 className="section-title">
                        <FileText size={24} />
                        {lang === 'ar' ? '1. حقوق الملكية الفكرية' : '1. Intellectual Property Rights'}
                    </h2>
                    <p className="section-text text-arabic">
                        {lang === 'ar' ? (
                            <>
                                جميع التصميمات، والأكواد البرمجية، وهيكلة الموقع، والمحتوى المرئي لمشروع <strong>"الصراط المستقيم"</strong> محمية بالكامل.
                                تعود ملكية هذا المشروع للمطور <strong>عبد الله وليد كمال</strong>.
                            </>
                        ) : (
                            <>
                                All designs, source code, site structure, and visual content of the <strong>"As-Sirat Al-Mustaqeem" (Zad El-Muslim)</strong> project are fully protected.
                                This project is owned by the developer <strong>Abdallah Waleed Kamal</strong>.
                            </>
                        )}
                    </p>
                </section>

                <section className="terms-section">
                    <h2 className="section-title">
                        <AlertCircle size={24} />
                        {lang === 'ar' ? '2. إعادة الاستخدام والنسخ' : '2. Reuse and Copying'}
                    </h2>
                    <p className="section-text text-arabic">
                        {lang === 'ar' ? (
                            <>
                                <strong>يُمنع منعاً باتاً</strong> نسخ، أو إعادة استخدام، أو إعادة تسمية (Rebranding)، أو توزيع أي جزء من هذا المشروع (سواء كان كود برمجي أو تصميم) دون الحصول على إذن كتابي مسبق من المالك.
                                أي استخدام غير مصرح به يعرضك للمساءلة القانونية.
                            </>
                        ) : (
                            <>
                                It is <strong>strictly prohibited</strong> to copy, reuse, rebrand, or distribute any part of this project (whether source code or design) without prior written permission from the owner.
                                Unauthorized use will result in legal action.
                            </>
                        )}
                    </p>
                </section>

                <section className="terms-section">
                    <h2 className="section-title">
                        <BookOpen size={24} />
                        {lang === 'ar' ? '3. التسجيل القانوني' : '3. Legal Registration'}
                    </h2>
                    <p className="section-text text-arabic">
                        {lang === 'ar' ? (
                            <>
                                هذا المشروع مسجل كملكية فكرية رقمية لدى <strong>هيئة تنمية صناعة تكنولوجيا المعلومات (ITIDA)</strong> في جمهورية مصر العربية.
                                يتم الاحتفاظ بجميع الوثائق الرسمية كدليل على الملكية.
                            </>
                        ) : (
                            <>
                                This project is registered as a Digital Intellectual Property with the <strong>Information Technology Industry Development Agency (ITIDA)</strong> in the Arab Republic of Egypt.
                                All official documentation is retained as proof of ownership.
                            </>
                        )}
                    </p>
                </section>

                <section className="terms-section">
                    <h2 className="section-title">
                        <Shield size={24} />
                        {lang === 'ar' ? '4. الرقابة والحماية' : '4. Monitoring and Protection'}
                    </h2>
                    <p className="section-text text-arabic">
                        {lang === 'ar' ? (
                            <>
                                يتم مراقبة الإنترنت دورياً للبحث عن أي نسخ غير مصرح بها لهذا المشروع. في حالة رصد أي سرقة للمحتوى أو التصميم، سيتم اتخاذ الإجراءات القانونية فوراً بما في ذلك تقديم شكاوى DMCA لشركة جوجل ومزودي خدمات الاستضافة.
                            </>
                        ) : (
                            <>
                                The internet is periodically monitored for any unauthorized copies of this project. If any theft of content or design is detected, legal action will be taken immediately, including submitting DMCA complaints to Google and hosting service providers.
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

export default Terms;
