var $num = $('.card-carousel .my-card').length;
var $currentIndex = 0;

function initializeCards() {
    $('.card-carousel .my-card').removeClass('active prev next');
    $('.card-carousel .my-card').eq($currentIndex).addClass('active');
    $('.card-carousel .my-card').eq(($currentIndex - 1 + $num) % $num).addClass('prev');
    $('.card-carousel .my-card').eq(($currentIndex + 1) % $num).addClass('next');
}

function rotateCards() {
    $currentIndex = ($currentIndex + 1) % $num;
    $('.card-carousel .my-card').removeClass('active prev next');
    $('.card-carousel .my-card').eq($currentIndex).addClass('active');
    $('.card-carousel .my-card').eq(($currentIndex - 1 + $num) % $num).addClass('prev');
    $('.card-carousel .my-card').eq(($currentIndex + 1) % $num).addClass('next');
}

initializeCards();
setInterval(rotateCards, 4000);


/*******************************************DISABLE RIGHT CLICK*******************************************/

    document.addEventListener('contextmenu', event => event.preventDefault());


    // Keyboard nav
    $('html body').keydown(function(e) {
        if (e.keyCode == 37) { // left
            $('.card-carousel .active').prev().trigger('click');
        }
        else if (e.keyCode == 39) { // right
            $('.card-carousel .active').next().trigger('click');
        }
    });

/******************************************TTS SECTION***************************************/

//Text To Speech Variables
const textarea = document.querySelector("textarea"),
voiceList = document.querySelector("select"),
speechBtn = document.getElementById("convert_speech"),
clearBtn = document.getElementById("clearBtn");

let synth = speechSynthesis,
isSpeaking = true,
utterance;

voices();

textarea.addEventListener("input", function () {
    if (textarea.value.length > 0) {
      // If the textarea has content, add the "show" class to display the button
      clearBtn.classList.add("show");
      clearBtn.classList.remove("hide");
    } else {
      // If the textarea is empty, add the "hide" class to hide the button
      clearBtn.classList.add("hide");
      clearBtn.classList.remove("show");
    }
  });

// Clear Button Function
clearBtn.addEventListener("click", e =>{
    textarea.value = "";
    clearBtn.classList.add("hide");
    clearBtn.classList.remove("show");
});

// Select Voice Function
function voices() {
    let defaultVoice = "hi-IN"; // or use "hi-IN" if available

    for (let voice of synth.getVoices()) {
        let selected = (voice.name === "Google US English" || voice.lang === "hi-IN") ? "selected" : ""; // Set Hindi as default if available
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    }
}


synth.addEventListener("voiceschanged", voices);

// Text To Speech Function
function textToSpeech(text){
    utterance = new SpeechSynthesisUtterance(text);
    for(let voice of synth.getVoices()){
        if(voice.name === voiceList.value){
            utterance.voice = voice;
        }
    }
    synth.speak(utterance);
}

// Speech Button Function
speechBtn.addEventListener("click", e =>{
    e.preventDefault();
    if(textarea.value !== ""){
        if(!synth.speaking){
            textToSpeech(textarea.value);
        }
        if(textarea.value.length > 20){
            setInterval(()=>{
                if(!synth.speaking && !isSpeaking){
                    isSpeaking = true;
                    speechBtn.innerText = "Convert To Speech";
                }else{
                }
            }, 500);
            if(isSpeaking){
                synth.resume();
                isSpeaking = false;
                speechBtn.innerText = "Pause";
            }else{
                synth.pause();
                isSpeaking = true;
                speechBtn.innerText = "Resume";
            }
        }else{
            speechBtn.innerText = "Convert To Speech";
        }
    }
});