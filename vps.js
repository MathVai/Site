let screenHeight = window.innerHeight;
let vpsValue = Math.round(screenHeight / 250); 
document.documentElement.style.setProperty('--vps', `${vpsValue}px`);

console.log(`vpsValue: ${vpsValue}px`); 

