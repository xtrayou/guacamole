// Dark Mode Toggle Script
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const mainElement = document.querySelector('main');
    const themeIcon = document.querySelector('.vector');
    
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
