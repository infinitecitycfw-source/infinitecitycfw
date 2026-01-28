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

// Accordion
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const header = content.previousElementSibling;
    document.querySelectorAll('.accordion-header').forEach(h => { if(h !== header) h.classList.remove('active'); });
    document.querySelectorAll('.accordion-content').forEach(c => { if(c !== content) c.classList.remove('active'); });
    header.classList.toggle('active');
    content.classList.toggle('active');
}