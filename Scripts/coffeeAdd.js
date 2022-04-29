let ingredientsArr = [];
let filteredIngredientsByName = [];
let filteredIngredientsByNameThenUOM = [];
let cleanSelectedIngredientName = [];
let ingredientNameAndAllUOM = [];

const ApiKey = "h84wyFrgyj1xYbTC402ZdTfL";

window.addEventListener('DOMContentLoaded', pageLoaded());

function pageLoaded() {
    getIngredients();
    if (localStorage.getItem(apiKey) != null) { //checks local storage for saved key
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
        error: function() { //returns fake list for ddebuging in local
            console.log("Fake List")
            ingredientBtn([{ "id": "1f75f6fc-3891-48e3-aa74-a54336f8313e", "name": "Salt", "uom": "g" }, { "id": "53b1678d-45e8-4f5c-9f51-ed3569e91168", "name": "Salt", "uom": "kg" }, { "id": "fa3713b0-003b-4518-b460-c4d4936773cb", "name": "Sugar", "uom": "g" }, { "id": "afa1c245-ebd6-4477-a13d-69609062c6ee", "name": "Sugar", "uom": "kg" }, { "id": "d7e3e794-40a5-4e7f-ba48-b450ff075312", "name": "Sugar", "uom": "kg" }, { "id": "182aa493-6dd9-4927-bc4f-c5d1c0399a84", "name": "Sugar", "uom": "Litre" }, { "id": "de61cdee-e7c9-48d0-934f-d806e5a48bca", "name": "Sugar", "uom": "g" }, { "id": "f151d0cd-8eb2-4727-be72-e2ac30203a42", "name": "Sugar", "uom": "g" }, { "id": "f1182bd7-1369-458e-b1d0-4e90f898d5a4", "name": "Sugar", "uom": "g" }, { "id": "840ce569-6870-4cf6-bfed-60da9a7d9bd6", "name": "Sugar", "uom": "g" }, { "id": "b7abab6c-163d-46f5-970c-c19b25ddd83d", "name": "Sugar", "uom": "g" }, { "id": "77b9b5d8-6450-4d85-b661-4c04c59a5c42", "name": "Sugar", "uom": "g" }]);
        }
    })
}

function filters(result) {
    //console.log(result);
    ingredientsArr = result;
    const seen = new Set();
    filteredIngredientsByName = result.filter(el => { //filters the results into a list of just ingredient names and ids 
        const duplicate = seen.has(el.name);
        seen.add(el.name);
        return !duplicate;
    });
    // console.log(filteredIngredientsByName)

    filteredIngredientsByName.forEach(element => { //a filters the to create a list of names and the uom it can have
        let filteredElementByUOM = [];
        let elementWithSameName = [];
        const seen = new Set();
        elementWithSameName = ingredientsArr.filter(el => el.name === element.name)
        filteredElementByUOM = elementWithSameName.filter(el => {
            const duplicate = seen.has(el.uom);
            seen.add(el.uom);
            return !duplicate;
        });
        let uomList = [];
        filteredElementByUOM.forEach(el => uomList.push(el.uom))
            //console.log(uomList)
        let ingredient = {
            name: element.name,
            UOM: uomList
        }
        ingredientNameAndAllUOM.push(ingredient)
    })
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
        //console.log(element.name);
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

    let currentIngredient = ingredientNameAndAllUOM.filter(element => element.name == cleanIngredient)
        //console.log(currentIngredient)
    currentIngredient[0].UOM.forEach(element => {
        //console.log(element)
        document.getElementById(`${cleanIngredient}_ingredientUOM_list`).innerHTML +=
            `<option value="${element}">${element}</option>`;
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
    ingredientUOM = document.getElementById("ingredientUOMInput").value.toLowerCase();
    ingredientName = document.getElementById("ingredientNameInput").value.toLowerCase();
    if (ingredientName === "") {
        validationStatus = false;
        document.getElementById("ingredientUOMLabel").innerText = "Ingredient UOM  (Cannot Be Empty)";
    }
    if (ingredientUOM === "") {
        validationStatus = false;
        document.getElementById("ingredientNameLabel").innerText = "Ingredient Name  (Cannot Be Empty)";
    };
    let x = ingredientNameAndAllUOM.find(element => element.name === ingredientName) //get ingredient with the same name
    if (x != null) {
        if (x.UOM.find(element => element == ingredientUOM)) { //checks if it alread exisits
            validationStatus = false;
        }
    }
    console.log("validation statue = " + validationStatus);
    return validationStatus;
}

function postIngredient(ingredient) {
    let jsonIngredient = JSON.stringify(ingredient);
    jsonIngredient = jsonIngredient.toLowerCase();
    console.log(jsonIngredient);
    $.ajax({
        url: "https://api-coffeeservice.herokuapp.com/api/ingredients",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        headers: { "ApiKey": apiKey() },
        data: jsonIngredient,
        success: function(result) {
            getIngredients()
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