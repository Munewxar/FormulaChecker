/**
 *@author Steven Altamirano
 *@title Лабораторная работа N1-2
 *@task C2: C: Проверить, является ли формула СКНФ.
          2: Проверить, является лиф формула общезначимой.*/
 

// Для проверки СКНФ
 /**
  * (((A&B)&(A&B))|(A&(!B)))
  * ((A&B)|(A&(!B)))
  * (((X&Y)&(!Z))|((X&(!Y))&Z))
  * ((((X&(!Y))&Z)|(((!X)&(!Y))&Z))|((X&(!Y))&(!Z)))
  * (((X&(Y&(Z&W)))|(X&(Y&(Z&(!W)))))|(X&(Y&((!Z)&W))))
  * (((X&(Y&(Z&W)))|((X&Y)&(Z&W)))|(X&(Y&((!Z)&W))))
  * (((X&(Y&(Z&W)))|((X&Y&(Z&(!W)))))|(X&(Y&((!Z)&W))))
  * (((X&(Y&(Z&W)))|(X&(Y&(Z&(!W)))))|((X&((!Y)&(Z&W)))|(X&(Y&((!Z)&W)))))
  */

// Для проверки на универсальность  
 /**
  * ((A&B)->B) - является
  * (((P&(!Q))->Q)->(P->Q)) - не является
  */            

//Включение строгого стандарта написания js скриптов
"use strict";

/**
 * Функция, проверяющая, является ли введенная запись формулой и соответствует ли введенная формула правилам грамматики.
 * @author Альтамирано С. Д.
 */
function initialCheck(formula){
    //Проверка наличия скобок
    if (formula.match(/\(|\)/g) == null) {
        alert("Отсутствуют скобки!")
        return false;
    }
    let bracketsAmount = formula.match(/\(|\)/g);

    //Проверка наличия лишних символов
    if (formula.match(/(?!([A-Z]|&|\||\(|\)|!|-|>))./g)) {  //(?!) - искать любые символы, кроме заключённых в данные скобки
        alert("Некорректные символы!");
        return false;
    }

    if (bracketsAmount.length % 2 != 0){
        alert("Нечетное количество скобок!");
        return false;
    }

    //Массивы унарных и бинарных сложных подформул 
    let arrayUnaryComplexFormulas, arrayBinaryComplexFormulas; 
    do {
        //Поиск унарных сложных подформул 
        arrayUnaryComplexFormulas = formula.match(/\(![A-Z01]\)/g);
        //Если найдены унарные сложные подформулы
        if (arrayUnaryComplexFormulas) 
            arrayUnaryComplexFormulas.forEach(function (unaryComplexFormula) {
                formula = formula.replace(unaryComplexFormula, 1); //Замена унарных сложных подформул на константу
            });
        
        //Поиск бинарных сложных подформул 
        arrayBinaryComplexFormulas = formula.match(/\([A-Z01]([&|~]|(->))[A-Z01]\)/g);
        //Если найдены бинарные сложные подформулы
        if (arrayBinaryComplexFormulas) 
            arrayBinaryComplexFormulas.forEach(function (binaryComplexFormula) {
                formula = formula.replace(binaryComplexFormula, "1"); //Замена бинарных сложных подформул на константу
            });
    } while (arrayUnaryComplexFormulas || arrayBinaryComplexFormulas); //Пока в выражении есть унарные или бинарные сложные подформулы
    
    //Если вы выражении остались атомы или другие константы, то происходит их замена
    if (formula != "1")
        formula = formula.replace(/[A-Z0]/g, "1"); 
        
    //Если выражение соответствует грамматике, то в конце проверки в выражении останется только одна константа
    if (formula != "1"){
        alert("Формула не соответствует правилам грамматики!");
        return false;
    }

    return true;
}

/**
 * Функция, реагирующая на нажатие кнопки проверки СКНФ.
 * @author Альтамирано С. Д.
 */
function sknfButtonPress(){
    let formula = document.getElementById("formula").value.toString();
    if (initialCheck(formula))
        checkSKNF(formula);
}

/**
 * Функция, проверяющая введенную формулу на СКНФ.
 * @author Альтамирано С. Д.
 */
function checkSKNF(formula){
    var disjArray = formula.split('|');

    for (let i = 0; i < disjArray.length; ++i){
        let equalCounter = 0;
        for (let k = 0; k < disjArray.length; ++k){
            if (disjArray[i] == disjArray[k]){
                equalCounter++;
            }
        }

        if (equalCounter > 1){
            alert("NOT SKNF!")
            return;
        }
    }

    var uniqueVariables = Array.from(new Set(formula.match(/[A-Z]/g)));  //Очистка массива найденных атомов от повторов

    for (let i = 0; i < disjArray.length; ++i){
        let elementaryDisjUsedSymbols = disjArray[i].match(/[A-Z]/g);
        if (elementaryDisjUsedSymbols.length != uniqueVariables.length){
            alert("NOT SKNF!")
            return;
        }
        elementaryDisjUsedSymbols = Array.from(new Set(String(elementaryDisjUsedSymbols).match(/[A-Z]/g)));  //Очистка массива найденных атомов от повторов
        if (elementaryDisjUsedSymbols.length < uniqueVariables.length){
            alert("NOT SKNF!");
            return;
        }
    }

    alert("SKNF!");
    return;
}

/**
 * Функция, реагирующая на нажатие кнопки проверки универсальности.
 * @author Альтамирано С. Д.
 */
function universalityButtonPress(){
    let formula = document.getElementById("formula").value.toString();

    if (initialCheck(formula)){
        checkUniversality(formula);
    }
}

/**
 * Функция, проверяющая введенную формулу на универсальность.
 * @author Альтамирано С. Д.
 */
function checkUniversality(initialFormula){
    var symbolRegex = /[A-Z]/;
    var elementRegex = /[01]|[A-Z]/;
    var formulaRegex = /(\(\!([01]|[A-Z])\))|(\(([01]|[A-Z])([\&\|\~]|(\-\>))([01]|[A-Z])\))/;
    var negationFormulaRegex = /^(\(\!([01]|[A-Z])\))$/g;
    var conjunctionFormulaRegex = /^(\(([01]|[A-Z])\&([01]|[A-Z])\))$/;
    var disjunctionFormulaRegex = /^(\(([01]|[A-Z])\|([01]|[A-Z])\))$/;
    var implicationFormulaRegex = /^(\(([01]|[A-Z])\-\>([01]|[A-Z])\))$/;
    var equivalenceFormulaRegex = /^(\(([01]|[A-Z])\~([01]|[A-Z])\))$/;

    let uniqueSymbolsArray = Array.from(new Set(String(initialFormula).match(/[A-Z]/g)));
    let n = uniqueSymbolsArray.length;
    let binaryNumbersArray = [];

    getBinaryNumbers(n, binaryNumbersArray);

    for(let i = 0; i < binaryNumbersArray.length; ++i){
        let currentTruthTableString = initialFormula;
        while (formulaRegex.test(currentTruthTableString)){
            var currentFormula = currentTruthTableString.match(formulaRegex)[0];
            if (currentFormula.match(negationFormulaRegex)){
                let digit = changeSymbolToDigit(currentFormula.match(symbolRegex)[0], uniqueSymbolsArray, binaryNumbersArray[i]);
                currentTruthTableString = currentTruthTableString.replace(currentFormula, negation(digit));
            }else{
                let firstElementInCurrentFormula = currentFormula.match(elementRegex)[0];
                if(firstElementInCurrentFormula.match(symbolRegex)){
                    var firstOperand = changeSymbolToDigit(firstElementInCurrentFormula.match(symbolRegex)[0], uniqueSymbolsArray, binaryNumbersArray[i]);
                    currentFormula = currentFormula.replace(firstElementInCurrentFormula.match(symbolRegex)[0], "n");
                }else{
                    var firstOperand = firstElementInCurrentFormula;
                }

                let secondElementInCurrentFormula = currentFormula.match(elementRegex)[0];
                if(secondElementInCurrentFormula.match(symbolRegex)){
                    var secondOperand = changeSymbolToDigit(secondElementInCurrentFormula.match(symbolRegex)[0], uniqueSymbolsArray, binaryNumbersArray[i]);
                    currentFormula = currentFormula.replace(secondElementInCurrentFormula.match(symbolRegex)[0], "n");
                }else{
                    var secondOperand = secondElementInCurrentFormula;
                }

                if(currentTruthTableString.match(formulaRegex)[0].match(conjunctionFormulaRegex)) {
                    currentTruthTableString = currentTruthTableString.replace(currentTruthTableString.match(formulaRegex)[0], conjunction(firstOperand, secondOperand));
                } else if(currentTruthTableString.match(formulaRegex)[0].match(disjunctionFormulaRegex)) {
                    currentTruthTableString = currentTruthTableString.replace(currentTruthTableString.match(formulaRegex)[0], disjunction(firstOperand, secondOperand));
                } else if(currentTruthTableString.match(formulaRegex)[0].match(implicationFormulaRegex)) {
                    currentTruthTableString = currentTruthTableString.replace(currentTruthTableString.match(formulaRegex)[0], implication(firstOperand, secondOperand));
                } else if(currentTruthTableString.match(formulaRegex)[0].match(equivalenceFormulaRegex)) {
                    currentTruthTableString = currentTruthTableString.replace(currentTruthTableString.match(formulaRegex)[0], equivalence(firstOperand, secondOperand));
                }
            }
        }
        
        if (currentTruthTableString.indexOf("0") != -1){
            alert("FORMULA ISN'T UNIVERSAL!");
            return;
        }
    }

    alert("FORMULA IS UNIVERSAL!");
    return;
}

/**
 * Функция, получения массива двоичных чисел.
 * @author Альтамирано С. Д.
 */
function getBinaryNumbers(n, binaryNumbersArray){
    for(let i = 0; i < Math.pow(2, n); ++i) {
        let binaryNumber = i.toString(2).split("");
        while(binaryNumber.length < n) {
            binaryNumber.unshift("0");
        }
        binaryNumbersArray.push(binaryNumber);
    }
}

/**
 * Функция, производящая замену символа на соответствующую константу (0 или 1).
 * @author Альтамирано С. Д.
 */
function changeSymbolToDigit(symbol, uniqueSymbols, binaryNumber) {
    for(var i = 0; i < binaryNumber.length; i++) {
        if (uniqueSymbols.indexOf(symbol) == i) {
            var digit = binaryNumber[i];
            break;
        }
    }
    return digit;
}

/**
 * Функция, вычисления отрицания.
 * @author Альтамирано С. Д.
 */
function negation(operand) {
    if (operand == '0'){
        return '1';
    }else{
        return '0';
    }
}

/**
 * Функция, вычисления эквиваленции.
 * @author Альтамирано С. Д.
 */
function equivalence(firstElement, secondElement) {
    if ((firstElement == '1' && secondElement == '1') || (firstElement == '0' && secondElement == '0')){
        return '1';
    }else{
        return '0';
    }
}

/**
 * Функция, вычисления импликации.
 * @author Альтамирано С. Д.
 */
function implication(firstElement, secondElement) {
    if (firstElement == '1' && secondElement == '0'){
        return '0';
    }else{
        return '1';
    }
}

/**
 * Функция, вычисления конъюнкции.
 * @author Альтамирано С. Д.
 */
function conjunction(firstElement, secondElement) {
    if (firstElement == '1' && secondElement == '1'){
        return '1';
    }else{
        return '0';
    }
}

/**
 * Функция, вычисления дизъюнкции.
 * @author Альтамирано С. Д.
 */
function disjunction(firstElement, secondElement) {
    if (firstElement == '0' && secondElement == '0'){
        return '0';
    }else{
        return '1';
    }
}