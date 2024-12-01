


document.addEventListener("DOMContentLoaded", async ()=>{
    const req = await fetch('words_dictionary.json');
    const reqWords = await req.json();       

    const time = document.querySelector('time');
    const paragraph = document.querySelector('p');
    const input = document.querySelector('input');
    const game = document.querySelector('#game');
    const results = document.querySelector('#results');
    const wpm = document.querySelector('#results-wpm');
    const accuracy = document.querySelector('#results-accuracy');
    const button = document.querySelector('#reload-button');
    
    const INITIAL_TIME = 30;

    let words = [];
    let currentTime = INITIAL_TIME;
    let playing;

 
    initGame();
    //initEvents();

    function initGame(){
        game.style.display = 'flex'
        results.style.display = 'none'
        input.value = ''
        
        playing = false;

        words = Object.keys(reqWords).toSorted(
            () => Math.random() -0.5
        ).slice(0,50);

        currentTime = INITIAL_TIME;
        time.textContent = currentTime;

        paragraph.innerHTML = words.map((word, index) => {
            const letters = word.split('');

            return `
                <word>
                    ${letters.map(letter => `<letter>${letter}</letter>`).join('')}
                </word>
            `
        }).join('');


        const firstWord = paragraph.querySelector('word');
        firstWord.classList.add('active');
        firstWord.querySelector('letter').classList.add('active');

    } 

    function initEvents(){
        document.addEventListener('keydown', () => {
            input.focus()
            if(!playing){
                playing = true
                const intervalId = setInterval(() =>{
                    currentTime--
                    time.textContent = currentTime

                    if(currentTime === 0){
                        clearInterval(intervalId)
                        gameOver()
                    }
                }, 1000)
            }
        })

        input.addEventListener('keydown', onKeyDown)
        input.addEventListener('keyup', onKeyUp)
        button.addEventListener('click', initGame)
    }

    function onKeyDown(event){
        const currentWord = paragraph.querySelector('word.active')
        const currentLetter = currentWord.querySelector('letter.active');

        const {key} = event
        if(key === ' '){
            event.preventDefault()
            
            const nextWord = currentWord.nextElementSibling
            const nextLetter = nextWord.querySelector('letter');

            currentWord.classList.remove('active', 'marked');
            currentLetter.classList.remove('active');

            nextWord.classList.add('active')
            nextLetter.classList.remove('active');

            input.value = ''

            const hasMissedLetters = currentWord.querySelectorAll('letter:not(.correct)').length > 0
            const classToAdd = hasMissedLetters ? 'marked' : 'correct'
            currentWord.classList.add(classToAdd);

            return
        }

        if(key === 'Backspace'){
            const prevWord = currentWord.previousElementSibling
            const prevLetter = currentLetter.previousElementSibling

            if(!prevWord && !prevLetter){
                event.preventDefault()
                return
            }
        


            const wordMarked = paragraph.querySelector('word.marked')
            if(wordMarked && !prevLetter){
                event.preventDefault()
                prevWord.classList.remove('marked')
                prevWord.classList.add('active')

                const letterToGo = prevWord.querySelector('letter:last-child')

                currentLetter.classList.remove('active')
                letterToGo.classList.add('active')

                input.value = [
                    ...prevWord.querySelectorAll('letter.correct, letter.incorrect')
                ].map(el => {
                    return el.classList.contains('correct') ? el.innerText : '*'
                }).join('')
            }
        }
    }


    function onKeyUp(){
        const currentWord = paragraph.querySelector('word.active')
        const currentLetter = currentWord.querySelector('letter.active')

        const $currentWord = currentWord.innerText.trim()
        input.maxLength = $currentWord.length

        const allLetters = currentWord.querySelectorAll('letter')

        allLetters.forEach(letter => letter.classList.remove('correct', 'incorrect'))
        
    }
   

})