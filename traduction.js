




function changeLanguage(lang) {
    const elementsToTranslate = document.querySelectorAll('[data-translate]');

    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translatedText = translations[lang][key];

        if (translatedText) {
            element.textContent = translatedText;
        }
        // Sauvegarder la langue choisie
        localStorage.setItem('userLang', lang);

    });

    updateMinimizedWindowsLanguage();

}


const currentLanguageButton = document.getElementById('currentLanguage');
const languageOptions = document.querySelector('.language-options');
const languageDropdown = document.querySelector('.language-dropdown');

// Afficher le menu déroulant lors de l'entrée de la souris dans .language-dropdown
languageDropdown.addEventListener('mouseenter', function() {
    updateLanguageOptions();
    languageOptions.style.display = 'block';
});

// Cacher le menu déroulant lorsque la souris sort de .language-dropdown
languageDropdown.addEventListener('mouseleave', function() {
    languageOptions.style.display = 'none';
});

// Mettre à jour les options en fonction de la langue actuellement sélectionnée
function updateLanguageOptions() {
    const currentLang = currentLanguageButton.textContent.toLowerCase();
    document.querySelectorAll('.language-options a').forEach(anchor => {
        if (anchor.getAttribute('data-lang') === currentLang) {
            anchor.style.display = 'none';
        } else {
            anchor.style.display = 'block';
        }
    });
}

document.querySelectorAll('.language-options a').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        const lang = this.getAttribute('data-lang');
        changeLanguage(lang);
        currentLanguageButton.textContent = lang.toUpperCase();
        languageOptions.style.display = 'none';
    });
});

const defaultLang = 'fr'; 
const browserLang = navigator.language || navigator.userLanguage;
let savedLang = localStorage.getItem('userLang') || browserLang;

// Si la langue du navigateur n'est pas 'fr', utilisez 'en' par défaut
if (savedLang.substring(0, 2) !== 'fr') {
    savedLang = 'en';
}

// Appliquer la traduction
changeLanguage(savedLang);

// Mettre à jour le bouton de langue actuel pour afficher la langue correcte
if (currentLanguageButton) {
    currentLanguageButton.textContent = savedLang.toUpperCase();
}

function updateMinimizedWindowsLanguage() {
    const minimizedWindows = document.querySelectorAll('.minimized-window');
    
    minimizedWindows.forEach(minimizedWindow => {
        const windowId = minimizedWindow.id.replace('minimized-', ''); // retrouver l'ID original de la fenêtre
        const associatedWindow = document.getElementById(windowId);
        
        if (associatedWindow) {
            const windowTitleElement = associatedWindow.querySelector('.window-title');
            if (windowTitleElement) {
                // Mettez à jour le texte de la miniature avec le titre de la fenêtre traduit
                minimizedWindow.textContent = windowTitleElement.textContent;
            }
        }
    });
}

