const typingText = document.querySelector(".typing-text p"),
tapeSource = document.querySelector(".tape"),
inpField = document.querySelector(".wrapper .input-field"),
tryAgainBtn = document.querySelector(".content button"),
timeTag = document.querySelector(".time span b"),
mistakeTag = document.querySelector(".mistake span"),
wpmTag = document.querySelector(".wpm span"),
cpmTag = document.querySelector(".cpm span");
keySound = document.getElementById("key"); 
errorSound = document.getElementById("error"); 
lessonTape = document.querySelector(".tape"); 

let timer,
maxTime = 600,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;

function playKeySound() {
    keySound.currentTime = 0
    keySound.play(); 
} 

function playErrorSound() {
    errorSound.currentTime = 0
    errorSound.play(); 
} 

function playTape() {
    lessonTape.playbackRate = 0.5
    lessonTape.play()
}

function pauseTape() {
    lessonTape.pause()
}
function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * data.length);
    typingText.innerHTML = "";
    tapeSource.innerHTML = "";
    let source = `<source src="${data[ranIndex]['audio_uk']}" type="audio/mpeg">`
    tapeSource.innerHTML += source;

    data[ranIndex]['content'].split("").forEach(char => {
        let span = `<span>${char}</span>`;
	typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if(charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) {
            // Timer 
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if(typedChar == null) {
            // Backspace
            if(charIndex > 0) {
                playKeySound()
                charIndex--;
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                    characters[charIndex].classList.add("deleted");
                }
                characters[charIndex].classList.remove("correct", "incorrect", "corrected");
            }
        } else {
            if(characters[charIndex].innerText == typedChar) {
                playKeySound()
                if(characters[charIndex].classList.contains("deleted")) {
                    // Leave a tail
                    characters[charIndex].classList.add("corrected");
                } else{
                    characters[charIndex].classList.add("correct");
                }
            } else {
                playErrorSound()
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        clearInterval(timer);
        inpField.value = "";
    }   
}

function initTimer() {
    if(timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
    }
}

function resetGame() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
}


loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
