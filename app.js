// building our app architecture using the module pattern


//create a module using an IIFE that return an object with public methods 
//budget controller
var budgetController = (function () {

    var Expense = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function (totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function (id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    }

    var calculateTotal = function (type) {

        var sum = 0;

        data.allItems[type].forEach(function (curr) {
            sum += curr.value
        })

        data.totals[type] = sum;

    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: 0,
    };

    return {
        addItem: function (type, desc, val) {

            var newItem;
            var ID;


            //create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            //create new item
            if (type === 'exp') {
                newItem = new Expense(ID, desc, val)
            } else {
                newItem = new Income(ID, desc, val)
            }

            // put the item in the data structure
            data.allItems[type].push(newItem);

            // return the item in order to use it in other modules 
            return newItem;
        },



        deleteItem: function (type, id) {

            var index, ids;

            ids = data.allItems[type].map(function (curr) {
                return curr.id
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },




        calculateBudget: function () {

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget
            data.budget = data.totals.inc - data.totals.exp;


            //calculate the percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }


        },


        calculatePercentages: function () {

            data.allItems.exp.forEach(function (curr) {
                curr.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {

            var allPerc = data.allItems.exp.map(function (curr) {
                return curr.getPercentage();
            });

            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalExp: data.totals.exp,
                totalInc: data.totals.inc,
            }
        },

        //to see our data in the console
        testing: function () {
            console.log(data);
        }
    }

})();























//UI controller
var uiController = (function () {

    //put all DOM string in one object for easier manipulation
    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeList: '.income__list',
        expensesList: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }


    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i <= list.length; i++) {
            callback(list[i], i);
        }
    }




    return {

        getInput: function () {
            // return an object containing three input values
            return {
                type: document.querySelector(DOMstrings.inputType).value, //'inc' or 'exp'
                description: document.querySelector(DOMstrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }

        },

        //add items to the UI
        addListItem: function (obj, type) {
            var html, newHtml, element;
            //create html string for template list item
            if (type === "exp") {
                element = DOMstrings.expensesList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === "inc") {
                element = DOMstrings.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //put the actual data in html
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //insert html into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },


        deleteListItem: function (selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },



        //clear iput fields and put focus back to the description input 
        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);
            //convert the filds list to an array 
            fieldsArr = Array.prototype.slice.call(fields);


            fieldsArr.forEach(function (curr, indx, arr) {
                curr.value = "";
            });

            fieldsArr[0].focus();
        },

        //diplay the budget 
        diplayBudget: function (obj) {

            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },


        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function (curr, index) {
                if (percentages[index] > 0) {
                    curr.textContent = percentages[index] + '%';
                } else {
                    curr.textContent = '--';
                }
            })




        },

        displayDate: function () {

            var now = new Date();
            var month = now.getMonth();
            var year = now.getFullYear();

            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'Septembre', 'Octobre', 'November', 'December']

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        changeType: function () {

            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDesc + ',' + DOMstrings.inputValue);
            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },



        // make DOMstrings public for other modules
        getDOMStrings: function () {
            return DOMstrings;
        }
    }

})();






















//app controller
var controller = (function (budgetCntrl, uiCntrl) {



    var setupEventListeners = function () {

        var DOM = uiCntrl.getDOMStrings();

        // aquire the user input using the ui btn or the "enter" key
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) { /// older browsers use which instead of keycode 
                ctrlAddItem();
            }
        });

        //event delegation on the container (using event bubbling up from the button to the container) 
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        //on change event to change color of input 
        document.querySelector(DOM.inputType).addEventListener('change', uiCntrl.changeType);

    }



    var updateBudget = function () {

        //calculate budget
        budgetCntrl.calculateBudget();

        //return budget
        var budget = budgetCntrl.getBudget();

        //diplay budget
        uiCntrl.diplayBudget(budget);

    }



    var updatePercentages = function () {

        // calculate percentages
        budgetCntrl.calculatePercentages();

        //store the percentages
        var percentages = budgetCntrl.getPercentages();

        //display percentages
        uiCntrl.displayPercentages(percentages);
    }



    var ctrlAddItem = function () {

        //call the getInput method from the UI controller to get user input 
        var input = uiCntrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            //add the item to the budget controller data structure
            var newItem = budgetCntrl.addItem(input.type, input.description, input.value)

            //add items to the UI 
            uiCntrl.addListItem(newItem, input.type);

            //clear input field
            uiCntrl.clearFields();

            //calculate and update budget
            updateBudget();

            //calculate and update percentages
            updatePercentages();

        }
    }

    var ctrlDeleteItem = function (event) {

        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete item from data structure
            budgetCntrl.deleteItem(type, ID);

            //delete item from UI 
            uiCntrl.deleteListItem(itemID);

            //update budget 
            updateBudget();

            //calculate and update percentages
            updatePercentages();


        }





    }



    return {
        init: function () {
            console.log('app has started!');
            uiCntrl.displayDate();
            uiCntrl.diplayBudget({
                budget: 0,
                percentage: -1,
                totalExp: 0,
                totalInc: 0,
            })
            setupEventListeners();
        }
    }






})(budgetController, uiController);


controller.init();