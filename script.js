// Quick Links Functionality - النسخة المصلحة
document.addEventListener('DOMContentLoaded', function() {
    const quickLinkBtns = document.querySelectorAll('.quick-link-btn, .store-item-btn');
    
    quickLinkBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // شلنا e.preventDefault() عشان الرابط يفتح طبيعي
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
});
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

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // Form Progress Bar
    const applyForm = document.getElementById('applyForm');
    const formProgress = document.getElementById('formProgress');
    
    if (applyForm && formProgress) {
        const requiredFields = applyForm.querySelectorAll('[required]');
        const totalFields = requiredFields.length;
        
        function updateProgress() {
            let filledFields = 0;
            requiredFields.forEach(field => {
                if (field.value.trim() !== '') {
                    filledFields++;
                }
            });
            const progress = (filledFields / totalFields) * 100;
            formProgress.style.width = progress + '%';
        }
        
        requiredFields.forEach(field => {
            field.addEventListener('input', updateProgress);
            field.addEventListener('change', updateProgress);
        });
    }

    // Apply Form Submission
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successModal = document.getElementById('successModal');
    
    if (applyForm) {
        applyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!applyForm.checkValidity()) {
                applyForm.reportValidity();
                return;
            }
            
            if (loadingOverlay) loadingOverlay.style.display = 'flex';
            
            const submitBtn = applyForm.querySelector('.btn-submit');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'جاري الإرسال...';
            }
            
            const formData = new FormData(applyForm);
            const data = {};
            formData.forEach((value, key) => { data[key] = value; });

            const p1 = "https://discord.com/api/webhooks/";
            const p2 = "1465776810452058261/";
            const p3 = "Lidp5Iy_muDJtcU8HCnXT0yiWzkMlBT-yg-S7YVu3W1jnwGPgrMKGUgaKmczaqiPMrUt";
            const webhookURL = p1 + p2 + p3;

            const discordPayload = {
                content: "🔔 **وصل طلب تفعيل جديد للموقع!**",
                embeds: [{
                    title: "بيانات مقدم الطلب",
                    color: 10181046, 
                    fields: [
                        { name: "👤 الاسم الكامل", value: data.name || "غير متوفر", inline: true },
                        { name: "🎂 العمر", value: data.age || "غير متوفر", inline: true },
                        { name: "💬 ديسكورد", value: data.discord || "غير متوفر", inline: true },
                        { name: "🆔 FiveM / Steam", value: data.fivem || "غير متوفر", inline: true },
                        { name: "📝 سبب التفعيل", value: data.reason || "غير متوفر", inline: false }
                    ],
                    footer: { text: "نظام التفعيل التلقائي" },
                    timestamp: new Date()
                }]
            };

            fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            })
            .then(res => {
                if (!res.ok) throw new Error('فشل الإرسال');
                if (successModal) showSuccessModal(data);
                applyForm.reset();
                if (formProgress) formProgress.style.width = '0%';
                // مسح بيانات الديسكورد بعد الإرسال الناجح إذا أردت
                localStorage.removeItem('discordUserData');
            })
            .catch((err) => {
                alert('حدث خطأ في الإرسال، تأكد من الويب هوك.');
                console.error(err);
            })
            .finally(() => {
                if (loadingOverlay) loadingOverlay.style.display = 'none';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'إرسال طلب التفعيل';
                }
            });
        });
    }

    function showSuccessModal(data) {
        const modal = document.getElementById('successModal');
        const details = document.getElementById('successDetails');
        if (modal && details) {
            details.innerHTML = `
                <div class="detail-item"><strong>الاسم:</strong> ${data.name}</div>
                <div class="detail-item"><strong>العمر:</strong> ${data.age}</div>
                <div class="detail-item"><strong>Discord:</strong> ${data.discord}</div>
                <div class="detail-item"><strong>معرف FiveM:</strong> ${data.fivem}</div>
                <div class="detail-item"><strong>سبب التفعيل:</strong> ${data.reason}</div>
                <div class="detail-item"><strong>رقم الطلب:</strong> #${Math.floor(Math.random() * 10000)}</div>
            `;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    window.closeSuccessModal = function() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
});

// ==========================================
// Discord OAuth2 System
// ==========================================
const DISCORD_CLIENT_ID = '1466056044319867144'; 
const REDIRECT_URI = 'https://infinitecity.netlify.app/apply.html'; 

function initDiscordOAuth2() {
    const discordLoginBtn = document.getElementById('discordLoginBtn');
    
    if (discordLoginBtn) {
        discordLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
            window.location.href = discordAuthUrl;
        });
    }
    
    checkDiscordToken();
}

function checkDiscordToken() {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            fetchDiscordUserData(accessToken);
        }
    }
}

async function fetchDiscordUserData(accessToken) {
    try {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('discordUserData', JSON.stringify(userData));
            fillFormWithDiscordData(userData);
            window.location.hash = ''; // تنظيف الرابط
        }
    } catch (error) {
        console.error('Error fetching Discord user data:', error);
    }
}

function fillFormWithDiscordData(userData) {
    const nameInput = document.getElementById('name');
    const discordInput = document.getElementById('discord');
    
    if (nameInput && userData.username) {
        nameInput.value = userData.username;
        nameInput.readOnly = true;
        nameInput.style.backgroundColor = '#f0f4ff';
    }
    
    if (discordInput && userData.username) {
        // ديسكورد الجديد لا يستخدم الـ discriminator (الرقم #0000) في أغلب الحسابات
        discordInput.value = userData.discriminator !== '0' ? `${userData.username}#${userData.discriminator}` : userData.username;
        discordInput.readOnly = true;
        discordInput.style.backgroundColor = '#f0f4ff';
    }
    
    addDiscordIndicator();
}

function addDiscordIndicator() {
    const form = document.querySelector('#applyForm');
    const existingIndicator = document.querySelector('.discord-indicator');
    
    if (form && !existingIndicator) {
        const indicator = document.createElement('div');
        indicator.className = 'discord-indicator';
        indicator.innerHTML = `
            <div style="background: rgba(114, 137, 218, 0.1); border: 1px solid #7289da; border-radius: 8px; padding: 10px; margin-bottom: 15px; text-align: center; color: #7289da;">
                <i class="fab fa-discord"></i> متصل بحساب ديسكورد بنجاح
            </div>
        `;
        form.insertBefore(indicator, form.firstChild);
    }
}

function checkStoredDiscordData() {
    const storedData = localStorage.getItem('discordUserData');
    if (storedData) {
        try {
            fillFormWithDiscordData(JSON.parse(storedData));
        } catch (e) {
            console.error(e);
        }
    }
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', function() {
    initDiscordOAuth2();
    checkStoredDiscordData();
});

// Accordion Function
function toggleAccordion(id) {
    const content = document.getElementById(id);
    if (!content) return;
    const header = content.previousElementSibling;
    header.classList.toggle('active');
    content.classList.toggle('active');
}
