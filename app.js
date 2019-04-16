// building our app architecture using the module pattern


//create a module using an IIFE that return an object with public methods 
//budget controller
var budgetController = (function () {

    //some code

})();







//UI controller
var uiController = (function () {

    //put all DOM string in one object for easier manipulation
    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {

        getInput: function () {
            // return an object containing three input values
            return {
                type: document.querySelector(DOMstrings.inputType).value, //'inc' or 'exp'
                description: document.querySelector(DOMstrings.inputDesc).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            }

        },
        // make DOMstrings public for other modules
        getDOMStrings: function () {
            return DOMstrings;
        }
    }

})();








//app controller
var controller = (function (budgetCntrl, uiCntrl) {

    var DOM = uiCntrl.getDOMStrings();

    var ctrlAddItem = function () {

        //call the getInput method from the UI controller to get user input 
        var input = uiCntrl.getInput();
        console.log(input);

    }



    // aquire the user input using the ui btn or the "enter" key
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) { /// older browsers use which instead of keycode 
            ctrlAddItem();
        }
    });


})(budgetController, uiController);