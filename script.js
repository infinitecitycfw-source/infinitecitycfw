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
                    title: "بيانات مقدم الطلب",
                    color: 10181046, 
                    fields: [
                        { name: "👤 الاسم", value: data.name || "غير متوفر", inline: true },
                        { name: "🎂 العمر", value: data.age || "غير متوفر", inline: true },
                        { name: "💬 ديسكورد", value: data.discord || "غير متوفر", inline: true },
                        { name: "📝 السبب", value: data.reason || "غير متوفر", inline: false }
                    ],
                    timestamp: new Date()
                }]
            };

            fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            })
            .then(res => {
                if (res.ok) {
                    alert('تم إرسال طلبك بنجاح!');
                    applyForm.reset();
                } else {
                    alert('فشل في الإرسال، تأكد من إعدادات الويب هوك.');
                }
            })
            .catch(err => console.error('خطأ:', err));
        });
    }
});

// 5. نظام الديسكورد (OAuth2) - إذا كنت تستخدمه
const DISCORD_CLIENT_ID = '1466056044319867144'; 
const REDIRECT_URI = window.location.origin + '/apply.html'; 

function initDiscordLogin() {
    const loginBtn = document.getElementById('discordLoginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
            window.location.href = url;
        });
    }
}

// تشغيل الوظائف عند التحميل
document.addEventListener('DOMContentLoaded', initDiscordLogin);