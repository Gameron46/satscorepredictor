function scorePredictor() {
    var numPracTests = document.getElementById("numTests").value;
    var numEntered = 0;
    var mathScores = [];
    var readScores = [];

    function updateContent() {
        var newBody = `
            <h1>Home</h1>
            <p>Please enter your math score on the left and your reading score on the right.</p>
            <p>You have entered ${numEntered} out of ${numPracTests} score(s).</p>
            <br>
            <input type="number" id="score1" min="0" oninput="validity.valid||(value='');">
            <input type="number" id="score2" min="0" oninput="validity.valid||(value='');">
            <br>
            <input type="submit" id="submitScore" value="Submit Score">
        `;
        if (numEntered == 0) {
            document.getElementById('home').innerHTML = newBody;
        }
        else {
            document.getElementById('home').innerHTML = 
                `
                <h1>Home</h1>
                <p>Please enter your math score on the left, your reading score in the middle, and the number of days between this test and the first practice test.</p>
                <p>You have entered ${numEntered} out of ${numPracTests} score(s).</p>
                <br>
                <input type="number" id="score1" min="0" oninput="validity.valid||(value='');">
                <input type="number" id="score2" min="0" oninput="validity.valid||(value='');">
                <input type="number" id="numDays" min="0" oninput="validity.valid||(value='');">
                <br>
                <input type="submit" id="submitScore" value="Submit Score">
                `;
        }

        document.getElementById('submitScore').onclick = function() {
            const score1 = document.getElementById('score1').value;
            const score2 = document.getElementById('score2').value;

            if (numEntered < 1) {
                if (score1 !== "" && score2 !== "") {
                    numEntered++;
                    mathScores.push([0.001, parseInt(score1)])
                    readScores.push([0.001, parseInt(score2)])
                    if (numEntered < numPracTests) {
                        updateContent();
                    } 
                    else {
                        document.getElementById('home').innerHTML = `
                            <h1>Home</h1>
                            <p>All ${numPracTests} scores have been entered! Now, please enter the number of days after the first practice test that you plan on taking the actual test.</p>
                            <input type="number" id="daysTillTest" min="0" oninput="validity.valid||(value='');">
                            <br>
                            <input type="submit" id="calculate">`;
                            document.getElementById('calculate').onclick = function() {
                                if (document.getElementById('daysTillTest').value !== "") {
                                    const days = parseInt(document.getElementById('daysTillTest').value);
                                    calculateScore(days);
                                }
                                else {
                                    alert("Please enter in a value!")
                                }
                            }
                    }
                } 
                else {
                    alert("Please enter valid scores for both fields.");
                }
            }
            else {
                const score1 = document.getElementById('score1').value;
                const score2 = document.getElementById('score2').value;
                const numDays = document.getElementById('numDays').value;

                if (score1 !== "" && score2 !== "" && numDays !== "") {
                    numEntered++;
                    mathScores.push([parseInt(numDays), parseInt(score1)])
                    readScores.push([parseInt(numDays), parseInt(score2)])
                    if (numEntered < numPracTests) {
                        updateContent();
                    } 
                    else {
                        document.getElementById('home').innerHTML = `
                            <h1>Home</h1>
                            <p>All ${numPracTests} scores have been entered! Now, please enter the number of days after the first practice test that you plan on taking the actual test.</p>
                            <input type="number" id="daysTillTest" min="0" oninput="validity.valid||(value='');">
                            <br>
                            <input type="submit" id="calculate">`;
                            document.getElementById('calculate').onclick = function() {
                                if (document.getElementById('daysTillTest').value !== "") {
                                    const days = parseInt(document.getElementById('daysTillTest').value);
                                    calculateScore(days);
                                }
                                else {
                                    alert("Please enter in a value!")
                                }
                            }
                    }
                } 
                else {
                    alert("Please enter valid scores for both fields.");
                }
            }
        };
    }
    function calculateScore(daysTest) {
        var predictedReadScore
        var predictedMathScore
        var predictedTotalScore
        if (numPracTests == 1) {
            predictedReadScore = readScores[0][1]
            predictedMathScore = mathScores[0][1]
        }
        else if (numPracTests == 2) {
            const linearMath = regression.linear(mathScores)
            const linearRead = regression.linear(readScores)

            predictedMathScore = linearMath.predict(50)[1]
            predictedReadScore = linearRead.predict(50)[1]
        }
        else {
            const linearMath = regression.linear(mathScores)
            const linearRead = regression.linear(readScores)

            const quadraticMath = regression.polynomial(mathScores, { order: 2 });
            const quadraticRead = regression.polynomial(readScores, { order: 2 });

            const logarithmicMath = regression.logarithmic(mathScores)
            const logarithmicRead = regression.logarithmic(readScores)

            const bestMathR = Math.max(linearMath.r2, quadraticMath.r2, logarithmicMath.r2)
            const bestReadR = Math.max(linearRead.r2, quadraticRead.r2, logarithmicRead.r2)

            const bestMathModel = bestMathR === linearMath.r2 ? linearMath : bestMathR === quadraticMath.r ? quadraticMath : logarithmicMath;
            const bestReadModel = bestReadR === linearRead.r2 ? linearRead : bestReadR === quadraticRead.r2 ? quadraticRead : logarithmicRead;

            predictedMathScore = bestMathModel.predict(daysTest)[1]
            predictedReadScore = bestReadModel.predict(daysTest)[1]
        }
        if (predictedMathScore > 800) {
            predictedMathScore = 800
        }
        if (predictedReadScore > 800) {
            predictedReadScore = 800
        }
        if (predictedMathScore < 200) {
            predictedMathScore = 200
        }
        if (predictedReadScore < 200) {
            predictedReadScore = 200
        }

        predictedTotalScore = predictedMathScore + predictedReadScore

        document.getElementById('home').innerHTML = 
        `<h1>Home</h1>
        <p>Your predicted math score is ${Math.round(predictedMathScore)}.</p>
        <p>Your predicted reading score is ${Math.round(predictedReadScore)}.</p>
        <p>Your predicted total score is ${Math.round(predictedTotalScore)}</p>`
    }
    if (numPracTests === "") {
        alert("Please enter in a value.")
    }
    else {
        updateContent();
    }
}