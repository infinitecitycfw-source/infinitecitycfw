// 1. نظام الروابط السريعة وأزرار المتجر (بدون حظر الروابط)
document.addEventListener('DOMContentLoaded', function() {
    // نحدد كل أزرار الروابط السريعة وأزرار المتجر
    const actionButtons = document.querySelectorAll('.quick-link-btn, .store-item-btn');
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // حركة ضغط بسيطة (بدون e.preventDefault)
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// 2. شاشة التحميل (Preloader)
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 500);
    }
});

// 3. قائمة الموبايل (Mobile Menu)
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // 4. نظام إرسال طلب التفعيل (Discord Webhook)
    const applyForm = document.getElementById('applyForm');
    if (applyForm) {
        applyForm.addEventListener('submit', function(e) {
            e.preventDefault(); // منع الصفحة من التحديث عند الإرسال
            
            const formData = new FormData(applyForm);
            const data = {};
            formData.forEach((value, key) => { data[key] = value; });

            // رابط الويب هوك الخاص بك
            const webhookURL = "https://discord.com/api/webhooks/1465776810452058261/Lidp5Iy_muDJtcU8HCnXT0yiWzkMlBT-yg-S7YVu3W1jnwGPgrMKGUgaKmczaqiPMrUt";

            const discordPayload = {
                content: "🔔 **وصل طلب تفعيل جديد!**",
                embeds: [{
                    title: "📋 طلب تفعيل Infinite City RP",
                    color: 10181046, 
                    fields: [
                        // الجزء الأول: البيانات الشخصية
                        { name: "👤 الهوية الواقعية", value: data.realIdentity || "غير متوفر", inline: false },
                        { name: "🎭 بطاقة تعريف الشخصية", value: data.characterIdentity || "غير متوفر", inline: false },
                        { name: "📖 السيرة الذاتية", value: data.characterBio || "غير متوفر", inline: false },
                        { name: "🧠 التحليل النفسي", value: data.psychologicalAnalysis || "غير متوفر", inline: false },
                        { name: "💼 السجل المهني", value: data.experience || "غير متوفر", inline: false },
                        { name: "🎯 الهدف من الاستيطان", value: data.settlementGoal || "غير متوفر", inline: false },
                        
                        // الجزء الثاني: اختبار الأداء
                        { name: "🤝 اختبار الأمانة", value: data.honestyTest || "غير متوفر", inline: false },
                        { name: "⚠️ إدارة الأزمات", value: data.crisisManagement || "غير متوفر", inline: false },
                        { name: "👤 موقف قلب الطاولة", value: data.hostageSituation || "غير متوفر", inline: false },
                        { name: "💗 قيمة الحياة (Fear RP)", value: data.fearRP || "غير متوفر", inline: false },
                        
                        // معلومات الاتصال
                        { name: "💬 ديسكورد", value: data.discord || "غير متوفر", inline: true },
                        { name: "🎮 معرف FiveM/Steam", value: data.fivem || "غير متوفر", inline: true }
                    ],
                    footer: {
                        text: "Infinite City RP - نظام طلبات التفعيل"
                    },
                    timestamp: new Date()
                }]
            };

            // إظهار شاشة التحميل
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
            }

            fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            })
            .then(res => {
                if (res.ok) {
                    // إخفاء شاشة التحميل
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                    }
                    
                    // إظهار النافذة المنبثقة للنجاح
                    const successModal = document.getElementById('successModal');
                    const successDetails = document.getElementById('successDetails');
                    
                    if (successModal && successDetails) {
                        successDetails.innerHTML = `
                            <p><strong>الاسم:</strong> ${data.realIdentity}</p>
                            <p><strong>ديسكورد:</strong> ${data.discord}</p>
                            <p><strong>معرف FiveM:</strong> ${data.fivem}</p>
                        `;
                        successModal.style.display = 'flex';
                    }
                    
                    applyForm.reset();
                } else {
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                    }
                    alert('فشل في الإرسال، تأكد من إعدادات الويب هوك.');
                }
            })
            .catch(err => {
                console.error('خطأ:', err);
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
                alert('حدث خطأ في الإرسال، يرجى المحاولة مرة أخرى.');
            });
        });
    }
});

// 5. نظام الديسكورد (OAuth2) - إذا كنت تستخدمه
const DISCORD_CLIENT_ID = '1466056044319867144'; 
const REDIRECT_URI = window.location.origin + '/apply.html'; 

function initDiscordLogin() {
    const loginBtn = document.getElementById('discordLoginBtn');
    if (!loginBtn) return;

    const CLIENT_ID = '1462616394012295270'; 
    // السطر القادم هو الأهم: يأخذ رابط الصفحة الحالية تلقائياً
    const REDIRECT_URI = encodeURIComponent(window.location.origin + window.location.pathname);
    
    const AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=identify`;

    loginBtn.href = AUTH_URL;
}

// 6. نظام الأكورديون للقوانين
function toggleAccordion(id) {
    const accordionContent = document.getElementById(id);
    const allAccordionContents = document.querySelectorAll('.accordion-content');
    const allAccordionHeaders = document.querySelectorAll('.accordion-header');
    
    // إغلاق جميع الأكورديونات الأخرى
    allAccordionContents.forEach(content => {
        if (content.id !== id) {
            content.classList.remove('active');
        }
    });
    
    // إزالة الكلاس النشط من جميع الهيدرات
    allAccordionHeaders.forEach(header => {
        header.classList.remove('active');
    });
    
    // فتح/إغلاق الأكورديون المطلوب
    if (accordionContent) {
        const isActive = accordionContent.classList.contains('active');
        
        if (!isActive) {
            accordionContent.classList.add('active');
            // إضافة الكلاس النشط للهيدر المقابل
            const currentHeader = document.querySelector(`[onclick="toggleAccordion('${id}')"]`);
            if (currentHeader) {
                currentHeader.classList.add('active');
            }
        } else {
            accordionContent.classList.remove('active');
        }
    }
}

// 7. إغلاق النافذة المنبثقة للنجاح
function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.style.display = 'none';
    }
}

// 8. تحديد الرابط النشط تلقائياً
function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // استخراج اسم الملف من الرابط
        const href = link.getAttribute('href');
        if (href) {
            const fileName = href.split('/').pop();
            
            // التحقق إذا كان الرابط هو الصفحة الحالية
            if (currentPath.includes(fileName) || 
                (currentPath === '/' && fileName === 'index.html') ||
                (currentPath.endsWith('/') && fileName === 'index.html')) {
                link.classList.add('active');
            }
        }
    });
}

// تشغيل الوظائف عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    initDiscordLogin();
    setActiveNavigation();
    
    // فتح أول قسم تلقائياً (اختياري)
    const firstAccordion = document.querySelector('.accordion-content');
    const firstHeader = document.querySelector('.accordion-header');
    if (firstAccordion && firstHeader) {
        firstAccordion.classList.add('active');
        firstHeader.classList.add('active');
    }
});