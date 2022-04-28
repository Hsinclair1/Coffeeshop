let ingredientsArr = [];
let filteredIngredientsByName = [];
let filteredIngredientsByNameThenUOM = [];
let cleanSelectedIngredientName = [];

const ApiKey = "h84wyFrgyj1xYbTC402ZdTfL";

window.addEventListener('DOMContentLoaded', pageLoaded());

function pageLoaded() {
    getIngredients();
    if (localStorage.getItem(apiKey) != null) {
        let key = localStorage.getItem(apiKey)
        document.getElementById("keyNameInput").value = key;
    }
}

function getIngredients() {
    $.ajax({
        url: "https://api-coffeeservice.herokuapp.com/api/ingredients",
        type: "GET",
        crossDomain: true,
        success: function(result) {
            ingredientBtn(result);
        },
        error: function() {
            ingredientBtn();
        }
    })

}

function filters(result) {
    console.log(result);
    ingredientsArr = result;
    const seen = new Set();
    const filteredIngredientsByName = result.filter(el => {
        const duplicate = seen.has(el.name);
        seen.add(el.name);
        return !duplicate;
    });
    const seen1 = new Set();
    const filteredIngredientsByNameThenUOM = filteredIngredientsByName.filter(el => {
        const duplicate = seen.has(el.uom);
        seen.add(el.uom);
        return !duplicate;
    });
}

function ingredientBtn(result) {
    filters(result);
    let arrCount = 0;
    filteredIngredientsByName.forEach(element => {
        document.getElementById("addIngredientBtn").innerHTML +=
            `<div class="d-flex flex-row " style="padding-left: 5%;">\
            <input type="checkbox" id="ingredient_${element.name}" col-2" name="ingredient_list" style="align-self: center">\
            <label for="ingredient_${element.name}" class="col-10" style="margin-top: 3.5%;">${element.name}</label>\
        </div>\
        <hr id="hr_${arrCount}"style="margin-block: 1%;">`;
        arrCount += 1;
        console.log(element.name);
    });
    document.getElementById(`hr_${arrCount-1}`).remove();
    $('input[name=ingredient_list]').change(function() {
        if ($(this).is(':checked')) {
            addIngredientUom(result, this.id)
        } else {
            removeIngredientUom(result, this.id)
        }
    });
}

function filteredArrNAME(ingredient) {
    const filteredArrNAME = result.filter(ingredient => ingredient.name == cleanIngredient);
}




function addIngredientUom(result, ingredient) {
    cleanIngredient = ingredient.split(`_`)[1];
    cleanSelectedIngredientName.push(cleanIngredient);
    document.getElementById("editIngredient").innerHTML +=
        `<div id="${ingredient}ID" class="d-flex flex-row m-1">
        <div id="ingredient_Name" class="col-4" style="display: flex; justify-content: center;">
            <p style="align-self: center; margin: 0%;">${cleanIngredient}</p>
        </div> 
        <div class="col-4 d-flex flex-row">                    
            <label for="Ingredient" class="form-label col-8" style="align-self: center; margin: 0%;">Ingredient Amount</label>
            <input type="number" class="form-control col-4" id="${ingredient}Amount">  
        </div>
        <div class="col-4">
            <select id="${cleanIngredient}_ingredientUOM_list"class="form-select" aria-label="Default select example">
                <option selected>Select Ingredient Uom</option>
            </select>
        </div>                                                    
    </div>`;

    filteredIngredientsByNameThenUOM.forEach(element => {
        document.getElementById(`${cleanIngredient}_ingredientUOM_list`).innerHTML +=
            `<option value="${element.uom}">${element.uom}</option>`;
    });
}

function removeIngredientUom(result, ingredient) {
    cleanIngredient = ingredient.split(`_`)[1];
    cleanSelectedIngredientName.pop(cleanIngredient);
    document.getElementById(`${ingredient}ID`).remove();
}

function submitCoffeeBTN() {
    if (coffeeValidation() === false) { return; }
    // let coffee = {
    //     coffeeName = document.getElementById("coffeeNameInput").value,
    //     coffeeDescription = document.getElementById("coffeeDescriptionInput").value,
    //     coffeeURL = document.getElementById("coffeeImageInput").value,
    //     ingredients = []
    // };
    // cleanIngredientName.forEach(element => {
    //     ingredientAmount = document.getElementById(`ingredient_${element}Amount`).value;
    //     ingredientUom = document.getElementById(`${element}_ingredientUOM_list`).value;
    // });
}

function coffeeValidation() {
    document.getElementById("coffeeNameInputLabel").innerText = "Name";
    document.getElementById("coffeeDescriptionInputLabel").innerText = "Description";
    document.getElementById("coffeeImageInputLabel").innerText = "Image Url";


    var validationStatus = true;
    let coffeeName = document.getElementById("coffeeNameInput").value;
    let coffeeDescription = document.getElementById("coffeeDescriptionInput").value;
    let coffeeURL = document.getElementById("coffeeImageInput").value;

    if (coffeeName == "") {
        document.getElementById("coffeeNameInputLabel").innerText = "Name  (Cannot Be Empty)";
        validationStatus = false;
    }
    if (coffeeDescription == "") {
        document.getElementById("coffeeDescriptionInputLabel").innerText = "Description  (Cannot Be Empty)";
        validationStatus = false;
    }
    if (coffeeURL == "") {
        document.getElementById("coffeeImageInputLabel").innerText = "Image Url  (Cannot Be Empty)";
        validationStatus = false;
    }
    if (document.getElementById("editIngredient").innerHTML != "") {
        if (addIngredientValidation() == false) { var validationStatus = false; }
    }
    return validationStatus;
}

function addIngredientValidation() {
    var validationStatus = true;
    cleanIngredientName.forEach(element => {
        let ingredientAmount = document.getElementById(`ingredient_${element}Amount`).value;
        let ingredientUom = document.getElementById(`${element}_ingredientUOM_list`).value;
        document.getElementById(`ingredient_${element}Amount`).style = "color: black;"
        document.getElementById(`${element}_ingredientUOM_list`).style = "color: black;";

        if (ingredientAmount <= 0 ||
            function isNumber(ingredientAmount) { return /^-?[\d.]+(?:e-?\d+)?$/.test(ingredientAmount); } ==
            false) {
            document.getElementById(`ingredient_${element}Amount`).value = 0;
            document.getElementById(`ingredient_${element}Amount`).style = "color: red;"
            validationStatus = false;
        }
        if (ingredientUom == "Select Ingredient Uom") {
            document.getElementById(`${element}_ingredientUOM_list`).style = "color: red;";
            validationStatus = false;
        }
    });
    return validationStatus;
}


function submitIngredientBTN() {
    if (ingredientValidation() === false) { return; }
    ingredientName = document.getElementById("ingredientNameInput").value;
    ingredientUOM = document.getElementById("ingredientUOMInput").value;
    let ingredient = {
        name: ingredientName,
        uom: ingredientUOM
    };
    postIngredient(ingredient);
}

function ingredientValidation() {
    var validationStatus = true;
    document.getElementById("ingredientNameLabel").innerText = "Ingredient Name";
    document.getElementById("ingredientUOMLabel").innerText = "Ingredient UOM";
    ingredientName = document.getElementById("ingredientUOMInput").value;
    ingredientUOM = document.getElementById("ingredientNameInput").value;
    if (ingredientName === "") {
        validationStatus = false;
        document.getElementById("ingredientUOMLabel").innerText = "Ingredient UOM  (Cannot Be Empty)";
    }
    if (ingredientUOM === "") {
        validationStatus = false;
        document.getElementById("ingredientNameLabel").innerText = "Ingredient Name  (Cannot Be Empty)";
    };
    if (ingredientsArrName.find(element => element.name === ingredientName)) {
        (ingredientsArrName.find(element => element.name === ingredientName))

    }
    return validationStatus;
}

function postIngredient(ingredient) {
    let jsonIngredient = JSON.stringify(ingredient);
    console.log(jsonIngredient);
    $.ajax({
        url: "https://api-coffeeservice.herokuapp.com/api/ingredients",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        headers: { "ApiKey": apiKey() },
        data: jsonIngredient,
        success: function(result) {
            console.log("success");
        },
        error: function(result) {
            console.log("no success");
        }
    });
}


function apiKey() {
    let key = document.getElementById("keyNameInput").value;
    localStorage.setItem(apiKey, key);
    return key;
}