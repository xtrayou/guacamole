// Dark Mode Toggle Script
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const mainElement = document.querySelector('main');
    const themeIcon = document.querySelector('.vector');
    
    // Captcha functionality
    let captchaCode = '';
    const captchaCanvas = document.getElementById('captcha-canvas');
    const refreshBtn = document.getElementById('refresh-captcha');
    const captchaInput = document.getElementById('captcha-input-field');
    const loginForm = document.querySelector('.captcha');
    
    // Generate captcha
    function generateCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
        captchaCode = '';
        for (let i = 0; i < 5; i++) {
            captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        drawCaptcha();
    }
    
    // Draw captcha on canvas
    function drawCaptcha() {
        const ctx = captchaCanvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);
        
        // Background
        ctx.fillStyle = '#e6e6e6';
        ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);
        
        // Add noise lines
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
            ctx.lineTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw text
        ctx.font = 'bold 28px monospace';
        ctx.fillStyle = '#333';
        ctx.textBaseline = 'middle';
        
        // Draw each character with random rotation
        for (let i = 0; i < captchaCode.length; i++) {
            ctx.save();
            const x = 20 + i * 35;
            const y = 30;
            const angle = (Math.random() - 0.5) * 0.4;
            
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillText(captchaCode[i], 0, 0);
            ctx.restore();
        }
        
        // Add noise dots
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
            ctx.fillRect(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height, 2, 2);
        }
    }
    
    // Refresh captcha
    refreshBtn.addEventListener('click', function() {
        generateCaptcha();
        captchaInput.value = '';
    });
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const enteredCaptcha = captchaInput.value.toUpperCase();
        
        if (enteredCaptcha !== captchaCode) {
            alert('Kode captcha salah! Silakan coba lagi.');
            generateCaptcha();
            captchaInput.value = '';
            return false;
        }
        
        // If captcha is correct, proceed with login
        const username = document.getElementById('username-input').value;
        const password = document.getElementById('password-input').value;
        
        // Send login request to server
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to admin dashboard
                window.location.href = data.redirect;
            } else {
                alert(data.message || 'Login gagal!');
                generateCaptcha();
                captchaInput.value = '';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan. Silakan coba lagi.');
            generateCaptcha();
            captchaInput.value = '';
        });
    });
    
    // Initialize captcha
    generateCaptcha();
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme on page load
    if (currentTheme === 'dark') {
        mainElement.classList.remove('login');
        mainElement.classList.add('dark-modelogin');
        updateIcon(true);
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        const isDark = mainElement.classList.contains('dark-modelogin');
        
        if (isDark) {
            // Switch to light mode
            mainElement.classList.remove('dark-modelogin');
            mainElement.classList.add('login');
            localStorage.setItem('theme', 'light');
            updateIcon(false);
        } else {
            // Switch to dark mode
            mainElement.classList.remove('login');
            mainElement.classList.add('dark-modelogin');
            localStorage.setItem('theme', 'dark');
            updateIcon(true);
        }
    });
    
    // Update icon based on theme
    function updateIcon(isDark) {
        if (isDark) {
            // Moon icon for dark mode (change to sun to indicate switching to light)
            themeIcon.setAttribute('src', 'img/sun.svg');
        } else {
            // Sun icon for light mode (change to moon to indicate switching to dark)
            themeIcon.setAttribute('src', 'img/vector.svg');
        }
    }
});
