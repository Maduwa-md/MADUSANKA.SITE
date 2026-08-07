/* ========== TYPING EFFECT ========== */
const words = ['Deploy Websites', 'Scale Apps', 'Secure Cloud', 'Automate CI/CD'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 60 : 120;
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
    }
    setTimeout(typeEffect, typeSpeed);
}

/* ========== LIVE CLOCK ========== */
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, '0');

    const clockEl = document.getElementById('clockTime');
    const ampmEl = document.getElementById('clockAmPm');
    const dateEl = document.getElementById('clockDate');

    if (clockEl) clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    if (ampmEl) ampmEl.textContent = ampm;
    if (dateEl) {
        const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', opts);
    }
}

/* ========== CALENDAR ========== */
let calCurrentDate = new Date();

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthYearEl = document.getElementById('calMonthYear');
    const daysEl = document.getElementById('calDays');
    if (!monthYearEl || !daysEl) return;

    const monthNames = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    daysEl.innerHTML = '';
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-day empty';
        daysEl.appendChild(empty);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'cal-day';
        dayEl.textContent = d;
        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayEl.classList.add('today');
        }
        daysEl.appendChild(dayEl);
    }
}

/* ========== NAVBAR SCROLL ========== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

/* ========== SCROLL REVEAL ========== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.about-card, .service-card, .section-header').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

/* ========== STATS COUNTER ========== */
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const nums = entry.target.querySelectorAll('.stat-num');
            nums.forEach(num => {
                const target = parseInt(num.dataset.target);
                let count = 0;
                const inc = target / 60;
                const timer = setInterval(() => {
                    count += inc;
                    if (count >= target) {
                        num.textContent = target;
                        clearInterval(timer);
                    } else {
                        num.textContent = Math.floor(count);
                    }
                }, 25);
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statObserver.observe(statsSection);

/* ========== TERMINAL ANIMATION ========== */
const terminalCommands = [
    {
        cmd: 'terraform init',
        output: `<span class="info">Initializing the backend...</span>\n<span class="info">Initializing provider plugins...</span>\n<span class="ok">✓ Terraform has been successfully initialized!</span>`
    },
    {
        cmd: 'terraform plan',
        output: `<span class="info">aws_instance.web: Refreshing state...</span>\n<span class="info">aws_lb.main: Refreshing state...</span>\n<span class="ok">Plan: 12 to add, 0 to change, 0 to destroy.</span>`
    },
    {
        cmd: 'terraform apply -auto-approve',
        output: `<div class="progress-track"><div class="progress-fill"></div></div>\n<span class="info">aws_vpc.main: Creating...</span>\n<span class="info">aws_instance.web: Still creating... [10s elapsed]</span>\n<span class="ok">✓ Apply complete! Resources: 12 added, 0 changed, 0 destroyed.</span>\n<span class="ok">Outputs: lb_dns = "web-prod-123.elb.amazonaws.com"</span>`
    },
    {
        cmd: 'kubectl get pods -n production',
        output: `<span class="info">NAME                              READY   STATUS</span>\n<span class="ok">web-app-7d9f4b8c5-x2v4k           1/1     Running</span>\n<span class="ok">api-gateway-5c8f9d2e1-a9b3c        1/1     Running</span>\n<span class="ok">redis-cache-0                     1/1     Running</span>\n<span class="ok">postgres-db-0                     1/1     Running</span>`
    },
    {
        cmd: 'curl -s https://api.madusanka.dev/health',
        output: `<span class="info">{</span>\n  <span class="info">"status": "healthy",</span>\n  <span class="info">"uptime": "99.99%",</span>\n  <span class="info">"response_time": "23ms",</span>\n  <span class="info">"region": "ap-south-1"</span>\n<span class="info">}</span>\n\n<span class="ok">🚀 Deployment successful! All systems operational.</span>`
    }
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeCommand(element, text, speed = 70) {
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await sleep(speed + Math.random() * 40);
    }
}

async function runTerminal() {
    const terminalBody = document.getElementById('terminalBody');
    if (!terminalBody) return;

    const observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
            observer.disconnect();
            for (let i = 0; i < terminalCommands.length; i++) {
                const cmdData = terminalCommands[i];
                const lineEl = document.getElementById(`tline${i + 1}`);
                const cmdEl = document.getElementById(`tcmd${i + 1}`);
                const outEl = document.getElementById(`tout${i + 1}`);
                if (!cmdEl || !outEl) continue;

                if (i > 0) {
                    const prevLine = document.getElementById(`tline${i}`);
                    if (prevLine) {
                        const prevCursor = prevLine.querySelector('.t-cursor');
                        if (prevCursor) prevCursor.classList.add('done');
                    }
                    lineEl.classList.remove('hidden');
                    lineEl.classList.add('visible');
                }

                const cursor = lineEl.querySelector('.t-cursor');
                if (cursor) cursor.classList.add('typing');
                await typeCommand(cmdEl, cmdData.cmd);
                if (cursor) cursor.classList.remove('typing');

                await sleep(400);
                outEl.classList.remove('hidden');
                outEl.classList.add('visible');
                outEl.innerHTML = cmdData.output;
                await sleep(2200);
            }
            const lastLine = document.getElementById(`tline${terminalCommands.length}`);
            if (lastLine) {
                const lastCursor = lastLine.querySelector('.t-cursor');
                if (lastCursor) lastCursor.classList.add('done');
            }
        }
    }, { threshold: 0.3 });

    observer.observe(terminalBody);
}

/* ========== CONTACT FORM ========== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = '✓ Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #00f260, #0575e6)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
                this.reset();
            }, 2500);
        }, 1500);
    });
}

/* ========== MOUSE PARALLAX ========== */
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.bg-orb');
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (window.innerWidth / 2 - e.clientX) / speed;
        const y = (window.innerHeight / 2 - e.clientY) / speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    updateClock();
    setInterval(updateClock, 1000);
    renderCalendar(calCurrentDate);
    runTerminal();

    document.getElementById('prevMonth')?.addEventListener('click', () => {
        calCurrentDate.setMonth(calCurrentDate.getMonth() - 1);
        renderCalendar(calCurrentDate);
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        calCurrentDate.setMonth(calCurrentDate.getMonth() + 1);
        renderCalendar(calCurrentDate);
    });
});
