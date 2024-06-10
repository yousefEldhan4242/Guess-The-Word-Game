// Setting Up The Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").textContent = `${gameName} Game Created By Yousef`

// Setting Game Options
let numberOftries = 6;
let numberOfLetter = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = ""
const words = ["Create", "Update", "Delete", "Master", "Branch", "Mainly", "Elzero", "School"]
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase()
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const hintButton = document.querySelector(".hint")
hintButton.addEventListener("click" , getHints)

function generateInput(){
    const inputsContainer = document.querySelector(".inputs")
    // Create Main Try Div
    for(let i = 1; i <= numberOftries; i++ ){
        const tryDiv = document.createElement("div")
        tryDiv.classList.add(`try-${i}`)
        tryDiv.innerHTML = `<span>Try ${i}</span>`

        if (i !== 1) tryDiv.classList.add("disabled-inputs")

        // Create Inputs
        for (let j = 1; j <= numberOfLetter; j++){
            const input = document.createElement("input")
            input.type = "text"
            input.id = `guess-${i}-letter-${j}`
            input.setAttribute("maxlength","1")
            tryDiv.appendChild(input)
        }
        inputsContainer.appendChild(tryDiv)
    }
    // Focus On First Input In First Try Div
    inputsContainer.children[0].children[1].focus()

    // Disable All Inputs Except First One
    const InputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input")
    InputsInDisabledDiv.forEach((input) => (input.disabled = true))

    const inputs = document.querySelectorAll("input")
    inputs.forEach((input , index)=>{
        input.addEventListener("input", function () {
            // Convert Input To UpperCase
            this.value = this.value.toUpperCase()

            // Navigate To Next Input On "input"
            const nextInput = inputs[index + 1]
            nextInput.focus()
        });

        input.addEventListener("keydown" , function (event){
            // For Testing
            // console.log(event)
            // console.log(inputs)
            // console.log(currentIndex)

            // To Convert Inputs From Node List Into An Array
            const currentIndex = Array.from(inputs).indexOf(this) // Or event.target 

            // Navigate To Next Input On Click Right Arrow
            if (event.key === "ArrowRight"){
                const nextInputIndex = currentIndex + 1
                if(nextInputIndex < inputs.length) inputs[nextInputIndex].focus()
            }

            // Navigate To Previous Input On Click Left Arrow
            if (event.key === "ArrowLeft"){
                const PrevInputIndex = currentIndex - 1
                if(PrevInputIndex >= 0) inputs[PrevInputIndex].focus()
                
            }
        })
    });
}
// For Testing
console.log(wordToGuess)

const guessButton = document.querySelector(".check")
guessButton.addEventListener("click" , handleGuesses)


function handleGuesses() {
    let successGuess = true;
    for (let i = 1; i <= numberOfLetter; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`)
        const letter = inputField.value.toLowerCase()
        const actualLetter = wordToGuess[i - 1]

            if(actualLetter === letter){
                // Letter Is Correct And In Place
                inputField.classList.add("yes-in-place");
            }else if (wordToGuess.includes(letter) && letter !== ""){
                // Letter Is Correct And Not In Place
                inputField.classList.add("not-in-place");
                successGuess = false;
            }else {
                // Letter Is  Wrong
                inputField.classList.add("no");
                successGuess = false;
        }
    }

    // Check If User Win Or Lose
    if(successGuess){
        messageArea.innerHTML = `Congratulations You Win The Word Is <span>${wordToGuess}</span>`

        if(numberOfHints === 2){
            messageArea.innerHTML = `Congratulations You Win The Word Is <span>${wordToGuess}</span><p>You Didn't Use Hints</p>`
        }
        // Add Disabled Class On All Divs
        let allTries = document.querySelectorAll(".inputs > div")
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"))

        // Disable Control Buttons
        guessButton.disabled = true
        hintButton.disabled = true;

    }else{

        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs")
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((currentTryInput) => currentTryInput.disabled = true);

        currentTry++;

        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((nextTryInput) => nextTryInput.disabled = false);

        let el = document.querySelector(`.try-${currentTry}`)
        if (el){
            el.classList.remove("disabled-inputs")
            el.children[1].focus()
        }else{
        // Disable Guess Button
            guessButton.disabled = true;
            hintButton.disabled = true;
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`
        }
    }

}
function getHints() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;


    }
    if(numberOfHints === 0){
        hintButton.disabled = true
        hintButton.innerHTML = `<span>${numberOfHints}</span> Hints`
    }
    if (numberOfHints === 1) {
        hintButton.innerHTML = `<span>${numberOfHints}</span> Hint`
    }
    const enabledInputs = document.querySelectorAll("input:not([disabled])")
    // console.log(enabledInputs)
    const emptyEnabledInputs = Array.from(enabledInputs).filter((emptyInput) => emptyInput.value === "")
    // console.log(emptyEnabledInputs)

    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length)
        const randomInput = emptyEnabledInputs[randomIndex]
        const randomIndexToFill = Array.from(enabledInputs).indexOf(randomInput)
        // For Testing
        // console.log(randomIndex)
        // console.log(randomInput)
        // console.log(randomIndexToFill)

        randomInput.value = wordToGuess[randomIndexToFill].toUpperCase()
    }
}

function handleBackSpace(event) {
    if (event.key === "Backspace") {

        const inputs = document.querySelectorAll("input:not([disabled])")
        const currentIndex = Array.from(inputs).indexOf(document.activeElement)
        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex]
            console.log(currentInput)
            // const prevInput = inputs[currentIndex - 1]
            currentInput.value = "";
            // prevInput.value = "";
            // prevInput.focus()
        }
    }
}
document.addEventListener("keydown" , handleBackSpace)
window.onload = function () {
    generateInput()
}
