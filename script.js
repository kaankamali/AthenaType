// script.js

const typingText = document.querySelector(".content-box");
const inpField = document.querySelector(".input-field");
const timeTag = document.querySelector("#time");
const mistakeTag = document.querySelector("#mistake");
const wpmTag = document.querySelector("#wpm");
const retryBtn = document.querySelector("#retry-btn");

let timer,
maxTime = 60,
timeLeft = maxTime,
charIndex = 0,
mistakes = 0,
isTyping = 0;

// Rastgele Türkçe kelimeler havuzu
const words = [
    "masa", "kitap", "bilgisayar", "kodlama", "yazılım", "geliştirici",
    "klavye", "ekran", "fare", "kahve", "satır", "fonksiyon", "değişken",
    "dizi", "obje", "internet", "tarayıcı", "sunucu", "veri", "algoritma",
    "sistem", "performans", "hız", "test", "zaman", "odak", "başarı",
    "öğrenmek", "çalışmak", "okumak", "yazmak", "düşünmek", "tasarım"
];

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * words.length);
    typingText.innerHTML = "";
    
    // Rastgele kelimeleri karıştırıp ekrana basalım (yaklaşık 50 kelime)
    let content = "";
    for(let i=0; i<50; i++) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        // Her harfi bir <span> içine alıyoruz ki tek tek stil verebilelim
        randomWord.split("").forEach(char => {
            content += `<span>${char}</span>`;
        });
        content += `<span> </span>`; // Kelime arası boşluk
    }
    
    typingText.innerHTML = content;
    typingText.querySelectorAll("span")[0].classList.add("active");
    
    // Tıklandığında inputa odaklan
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];

    // Süre bittiyse veya karakterler bittiyse dur
    if(charIndex < characters.length - 1 && timeLeft > 0) {
        if(!isTyping) { // Yazmaya başladığı an süreyi başlat
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        
        // Backspace (Silme) Mantığı
        if(typedChar == null) {
            if(charIndex > 0) {
                charIndex--;
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            // Doğru/Yanlış Kontrolü
            if(characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        
        // İmleci kaydır
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        // Hata ve WPM güncelle
        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        
        mistakeTag.innerText = mistakes;
        wpmTag.innerText = wpm;
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
}

loadParagraph();
inpField.addEventListener("input", initTyping);
retryBtn.addEventListener("click", resetGame);
