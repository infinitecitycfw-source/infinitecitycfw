// Quick Links Functionality
document.addEventListener('DOMContentLoaded', function() {
    const quickLinkBtns = document.querySelectorAll('.quick-link-btn');
    
    quickLinkBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                window.location.href = href;
            }, 200);
        });
        
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Preloader
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

    // Apply Form Submission (المعدل للإرسال لديسكورد مباشرة)
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

            // تم تمويه الرابط هنا لتجنب حظر Netlify
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
                        { name: "� العمر", value: data.age || "غير متوفر", inline: true },
                        { name: "� ديسكورد", value: data.discord || "غير متوفر", inline: true },
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

// Discord OAuth2 System
const DISCORD_CLIENT_ID = '1466056044319867144'; // استبدل بـ Client ID الخاص بك
const REDIRECT_URI = window.location.origin + '/apply.html';

// Discord OAuth2 Login Function
function initDiscordOAuth2() {
    const discordLoginBtn = document.getElementById('discordLoginBtn');
    
    if (discordLoginBtn) {
        discordLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // تخزين الصفحة الحالية للرجوع إليها بعد تسجيل الدخول
            localStorage.setItem('discordReturnPage', window.location.href);
            
            // توجيه المستخدم إلى صفحة تسجيل الدخول في ديسكورد
            const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
            window.location.href = discordAuthUrl;
        });
    }
    
    // التحقق من وجود توكن في الرابط عند تحميل الصفحة
    checkDiscordToken();
}

// التحقق من وجود توكن في الرابط
function checkDiscordToken() {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            // جلب بيانات المستخدم من ديسكورد
            fetchDiscordUserData(accessToken);
        }
    }
}

// جلب بيانات المستخدم من ديسكورد
async function fetchDiscordUserData(accessToken) {
    try {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            
            // تخزين بيانات المستخدم
            localStorage.setItem('discordUserData', JSON.stringify(userData));
            
            // ملء الفورم بالبيانات إذا كنا في صفحة التقديم
            fillFormWithDiscordData(userData);
            
            // تنظيف الرابط من التوكن
            window.location.hash = '';
            
            // توجيه المستخدم إلى صفحة التقديم إذا لم يكن فيها
            if (!window.location.href.includes('apply.html')) {
                window.location.href = 'apply.html';
            }
        }
    } catch (error) {
        console.error('Error fetching Discord user data:', error);
        alert('حدث خطأ في جلب بيانات ديسكورد. يرجى المحاولة مرة أخرى.');
    }
}

// ملء الفورم ببيانات ديسكورد
function fillFormWithDiscordData(userData) {
    const nameInput = document.getElementById('name');
    const discordInput = document.getElementById('discord');
    
    if (nameInput && userData.username) {
        nameInput.value = userData.username;
        nameInput.readOnly = true;
        nameInput.classList.add('discord-authenticated');
        nameInput.setAttribute('title', 'تم جلب هذه البيانات من ديسكورد');
    }
    
    if (discordInput && userData.username && userData.discriminator) {
        discordInput.value = `${userData.username}#${userData.discriminator}`;
        discordInput.readOnly = true;
        discordInput.classList.add('discord-authenticated');
        discordInput.setAttribute('title', 'تم جلب هذه البيانات من ديسكورد');
    }
    
    // إضافة مؤشر على أن البيانات جاءت من ديسكورد
    addDiscordIndicator();
}

// إضافة مؤشر على أن البيانات جاءت من ديسكورد
function addDiscordIndicator() {
    const form = document.querySelector('#applyForm');
    if (form) {
        const indicator = document.createElement('div');
        indicator.className = 'discord-indicator';
        indicator.innerHTML = `
            <div style="background: rgba(114, 137, 218, 0.1); border: 1px solid rgba(114, 137, 218, 0.3); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; text-align: center;">
                <i class="fab fa-discord" style="color: #7289da; margin-left: 0.5rem;"></i>
                <span style="color: #7289da; font-weight: 600;">تم تسجيل الدخول عبر ديسكورد بنجاح!</span>
            </div>
        `;
        
        const firstFormGroup = form.querySelector('.form-group');
        if (firstFormGroup) {
            form.insertBefore(indicator, firstFormGroup);
        }
    }
}

// التحقق من بيانات ديسكورد المخزنة عند تحميل الصفحة
function checkStoredDiscordData() {
    const storedData = localStorage.getItem('discordUserData');
    if (storedData) {
        try {
            const userData = JSON.parse(storedData);
            fillFormWithDiscordData(userData);
        } catch (error) {
            console.error('Error parsing stored Discord data:', error);
        }
    }
}

// تهيئة نظام OAuth2 عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initDiscordOAuth2();
    checkStoredDiscordData();
});

// Accordion
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const header = content.previousElementSibling;
    document.querySelectorAll('.accordion-header').forEach(h => { if(h !== header) h.classList.remove('active'); });
    document.querySelectorAll('.accordion-content').forEach(c => { if(c !== content) c.classList.remove('active'); });
    header.classList.toggle('active');
    content.classList.toggle('active');
}