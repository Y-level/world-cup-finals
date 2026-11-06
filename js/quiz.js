const QUESTIONS = [
    {
        text: "Если человека назвали мордофиля, то это…",
        answers: [
            {
                text: "Значит, что он тщеславный.",
                correct: true,
                explanation: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный."
            },
            { text: "Значит, что у него лицо как у хряка.", correct: false },
            { text: "Значит, что чумазый.", correct: false }
        ]
    },
    {
        text: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
        answers: [
            {
                text: "Он маленький и невзрачный.",
                correct: true,
                explanation: "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи."
            },
            { text: "Он тот еще алкоголик.", correct: false },
            { text: "Он не держит свое слово.", correct: false }
        ]
    },
    {
        text: "Если человека прозвали пятигузом, значит, он…",
        answers: [
            {
                text: "Не держит слово.",
                correct: true,
                explanation: "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек."
            },
            { text: "Изменяет жене.", correct: false },
            { text: "Без гроша в кармане.", correct: false }
        ]
    },
    {
        text: "Кто такой шлындра?",
        answers: [
            { text: "Обманщик.", correct: false },
            { text: "Нытик.", correct: false },
            {
                text: "Бродяга.",
                correct: true,
                explanation: "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться."
            }
        ]
    },
    {
        text: "В каком случае про человека можно сказать, что он охренел (в смысле «обнаглел/перешёл границы»), а не просто удивился?",
        answers: [
            {
                text: "Он без спроса берёт твои вещи и делает вид, что так и надо.",
                correct: true,
                explanation: "Правильно. Слово «охренел» многозначно, оно означает «обнаглел, потерял совесть»."
            },
            {
                text: "Он в наглую лезет без очереди и ещё возмущается, что его не пропускают.",
                correct: true,
                explanation: "Правильно. Слово «охренел» многозначно, оно означает «обнаглел, потерял совесть»."
            },
            { text: "Он съел много хрена и искренне удивился: «Какой жгучий, вот это да!»", correct: false },
            { text: "В осеннем лесу наблюдается завихрение листьев.", correct: false }
        ]
    }
];


const state = {
    locked: false,
    correct: 0,
    allAnswered: false,
    revealedItem: null
};


function shuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}


function vanish(buttons, callback) {
    if (!buttons.length) { callback(); return; }

    buttons.forEach(function (button, index) {
        window.setTimeout(function () {
            button.classList.add("vanish");
        }, index * 150);
    });

    window.setTimeout(callback, (buttons.length - 1) * 150 + 550);
}


function finishQuiz() {
    state.allAnswered = true;

    const status = document.getElementById("quiz-status");
    const stats  = document.getElementById("quiz-stats");

    if (status) status.textContent = "Вопросы закончились";
    if (stats)  stats.textContent  =
        "Правильных ответов: " + state.correct + " из " + QUESTIONS.length;

    document.querySelectorAll(".quiz-item").forEach(function (item) {
        item.classList.add("reveal-enabled");
    });
}


function showNextItem(currentItem) {
    const items = Array.from(document.querySelectorAll(".quiz-item"));
    const next = items[items.indexOf(currentItem) + 1];

    state.locked = false;

    if (!next) { finishQuiz(); return; }

    next.style.display = "block";
    window.requestAnimationFrame(function () {
        next.classList.add("appearing");
    });
}


function handleAnswer(item, selectedButton) {
    if (state.locked) return;

    state.locked = true;

    const isCorrect = selectedButton.dataset.correct === "true";

    const questionBlock = item.querySelector(".question-block");
    const marker = questionBlock.querySelector(".q-marker");
    const answersRow = item.querySelector(".answers-row");
    const allAnswers = Array.from(answersRow.querySelectorAll(".answer"));

    allAnswers.forEach(function (button) { button.disabled = true; });

    selectedButton.classList.add(isCorrect ? "correct" : "wrong-selected");
    if (isCorrect) state.correct += 1;

    window.setTimeout(function () {
        marker.textContent = isCorrect ? "✓" : "✕";
        marker.classList.add(isCorrect ? "correct" : "wrong");
    }, 500);

    window.setTimeout(function () {
        if (isCorrect) {
            const wrongAnswers = allAnswers.filter(function (button) {
                return button !== selectedButton;
            });

            vanish(wrongAnswers, function () {
                vanish([selectedButton], function () {
                    answersRow.style.display = "none";
                    showNextItem(item);
                });
            });
        } else {
            vanish(allAnswers, function () {
                answersRow.style.display = "none";
                showNextItem(item);
            });
        }
    }, isCorrect ? 1300 : 900);
}


function toggleReveal(item) {
    if (!state.allAnswered) return;

    const row = item.querySelector(".answers-row");
    const isSame = state.revealedItem === item;

    if (state.revealedItem) {
        state.revealedItem.querySelector(".answers-row").style.display = "none";
        state.revealedItem = null;
    }

    if (isSame) return;

    row.querySelectorAll(".answer").forEach(function (button) {
        button.style.display = "none";
    });

    row.querySelectorAll('.answer[data-correct="true"]').forEach(function (button) {
        button.classList.remove("vanish");
        button.classList.add("correct");
        button.style.display = "flex";
    });

    row.style.display = "flex";
    state.revealedItem = item;
}


function buildQuiz() {
    const quizArea = document.getElementById("quiz-area");
    if (!quizArea) return;

    shuffle(QUESTIONS).forEach(function (question, index) {
        const item = document.createElement("section");
        item.className = "quiz-item";

        const row = document.createElement("div");
        row.className = "quiz-row";

        const questionBlock = document.createElement("div");
        questionBlock.className = "question-block";
        questionBlock.innerHTML =
            '<span class="q-num">' + (index + 1) + ')</span>' +
            '<span class="q-text">' + question.text + '</span>' +
            '<span class="q-marker"></span>';

        const answersRow = document.createElement("div");
        answersRow.className = "answers-row";

        shuffle(question.answers).forEach(function (answer) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "answer";
            button.dataset.correct = answer.correct ? "true" : "false";

            button.innerHTML =
                '<span class="answer-text">' + answer.text + '</span>' +
                (answer.explanation
                    ? '<span class="answer-explanation">' + answer.explanation + '</span>'
                    : "");

            button.addEventListener("pointerdown", function () {
                if (state.locked) return;
                button.classList.add("shake");
                window.setTimeout(function () {
                    button.classList.remove("shake");
                }, 330);
            });

            button.addEventListener("click", function () {
                handleAnswer(item, button);
            });

            answersRow.appendChild(button);
        });

        row.appendChild(questionBlock);
        row.appendChild(answersRow);
        item.appendChild(row);

        questionBlock.addEventListener("click", function () {
            toggleReveal(item);
        });

        quizArea.appendChild(item);
    });

    console.log(QUESTIONS);
}


document.addEventListener("DOMContentLoaded", buildQuiz);