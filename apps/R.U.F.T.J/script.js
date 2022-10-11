const letsStart = document.getElementById('letsStart');
const dontShowAgain = document.getElementById('dontShowAgain');
const wellcomeCard = document.getElementsByClassName('wellcome-card')[0]

const requirementText = document.getElementById('requirementText');
const questionTemplate = document.getElementById('questionTemplate');

const requirementCard = document.getElementsByClassName('requirement-card')[0]
const submitRequirements = document.getElementById('submitRequirements');
const loadSample = document.getElementById('loadSample');

const testCard = document.getElementsByClassName('test-card')[0]
const showFitness = document.getElementById('showFitness');

const questionWrapper = document.getElementById('questionWrapper')

const resultCard = document.getElementsByClassName('result-card')[0];
const resultTitle = document.getElementsByClassName('result-title')[0];
const resultContent = document.getElementsByClassName('result-content')[0];
const resultImage = document.getElementsByClassName('result-image')[0];
const resultScore = document.getElementsByClassName('result-score')[0];

const lang_tr_btn = document.getElementById('lang_tr_btn');
const lang_en_btn = document.getElementById('lang_en_btn');

const result = document.getElementById('result');

const yc_init = (element) => {
    element["render"] = ((props) => {
        let html = element.innerHTML.trim();
        Object.keys(props).forEach((key) => {
            html = html.replaceAll("--["+key+"]--", props[key])
        })
        let temporary = document.createElement('template');
        temporary.innerHTML = html;
        return temporary.content.firstChild;
    }).bind(element)
}

const requirementListPreProcessing = (text) => {
    return text.split('\n').map(x => x.trim())
}

const createQuestions = (list) => {
    yc_init(questionTemplate);
    list.forEach((requirement, index) => {
        let q = questionTemplate.render({
            "RequirementNo": index+1,
            "RequirementText": requirement
        })
        questionWrapper.appendChild(q)
    });
}

const getAnswers = () => {
    var questions = document.querySelectorAll(".question")
    var answers = []
    questions.forEach((question) => {
        if(question.querySelector("input[type='radio']:checked") != null){
            answers.push(question.querySelector("input[type='radio']:checked").value)
            question.style.color = "inherit";
        }else{
            question.style.color = "red";
            answers.push(null)
        }
    })
    return answers;
}

showFitness.onclick = (e) => {
    let answers = getAnswers()
    let sum = 0
    if(answers.indexOf(null) == -1){ // any null in answers
        answers.forEach((answer) => {
            sum += parseFloat(answer)
        })
        let score = parseFloat(sum * 100 / answers.length).toFixed(2)
        Object.keys(lang[userLang].results).reverse().every((condition) => {
            if(eval(score + condition)){
                resultTitle.innerText = lang[userLang].results[condition].title
                resultContent.innerText = lang[userLang].results[condition].content
                resultScore.innerText = "%" + score;
                resultImage.src = lang[userLang].results[condition].image
                return false;
            }
            return true;
        })
        
        testCard.classList.add('d-none')
        resultCard.classList.remove('d-none')
    }
}

submitRequirements.onclick = (e) => {
    if(requirementText.value != ""){
        let requirementList = requirementListPreProcessing(requirementText.value);
        requirementCard.classList.add('d-none')
        createQuestions(requirementList)
        testCard.classList.remove('d-none')
        console.log(requirementList)
    }else{
        requirementText.classList.add('is-invalid')
    }
}

letsStart.onclick = (e) => {
    wellcomeCard.classList.add('d-none')
    requirementCard.classList.remove('d-none')
}

dontShowAgain.onclick = (e) => {
    localStorage.setItem('dontShowWellcomeCard', true);
    wellcomeCard.classList.add('d-none')
    requirementCard.classList.remove('d-none')
}

loadSample.onclick = (e) => {
    requirementText.value = lang[userLang].requirement_card.load_sample.content;
}

const changeLang = (e) => {
    localStorage.setItem("lang", e.target.value)
    location.href = location.href
}

lang_tr_btn.onclick = changeLang
lang_en_btn.onclick = changeLang

if(localStorage.getItem('dontShowWellcomeCard')){
    wellcomeCard.classList.add('d-none')
    requirementCard.classList.remove('d-none')
}