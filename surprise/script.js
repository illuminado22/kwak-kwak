const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const question = document.getElementById('question');
const celebrationPic = document.getElementById('celebrationPic');


function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 2 + 3 + "s";
    heart.style.fontSize = Math.random() * 20 + 10 + "px";
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000);
}

setInterval(createHeart, 300);


noBtn.addEventListener('mouseover', () => {

    const maxX = window.innerWidth - noBtn.offsetWidth;
    const maxY = window.innerHeight - noBtn.offsetHeight;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;


    noBtn.style.position = 'fixed'; 

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
});


yesBtn.addEventListener('click', () => {
    question.innerHTML = "Paldoooo hehe iloveyouu so so much mahal ko ❤️";

    celebrationPic.style.display = 'block';
    document.querySelector('.buttons').style.display = 'none';
    

    for(let i = 0; i < 50; i++) {
        setTimeout(createHeart, i * 50);
    }
});