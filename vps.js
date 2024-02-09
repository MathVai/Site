let screenHeight = window.innerHeight;
let vpsValue = Math.round(screenHeight / 275); 
document.documentElement.style.setProperty('--vps', `${vpsValue}px`);

window.getVps = () => vpsValue;