var path = window.location.pathname;
var page = path.split("/").pop();
console.log(page);

let text = "";

$(document).ready(function() {
    $.ajax({
        url: "https://api-coffeeservice.herokuapp.com/api/coffees",
        type: "GET",
        crossDomain: true,
        success: function(result) {
            console.log(result);
        }
    })
})

class Products {
    constructor(name, img, price) {
        this.name = name;
        this.img = img;
        this.price = price;
    }
}
const cappuccino = new Products("Cappuccino", "capuccino", "4");
const espresso = new Products("Espresso", "espresso", "2");
const flatwhite = new Products("Flatwhite", "flatwhite", "5");
const latte = new Products("Latte", "latte", "3");
const machiato = new Products("Machiato", "machiato", "6");
const mocha = new Products("Mocha", "mocha", "4");

const myProducts = [cappuccino, espresso, flatwhite, latte, machiato, mocha];
const productContainer = document.getElementById("allProducts");

if (page == "products.html") { myProducts.forEach(myFunction); } else if (page == "product.html") {
    var product_Page = window.location.search.substring(1);
    var pos = myProducts.map(function(e) { return e.img; }).indexOf(product_Page);
    for (let i = 1; i <= 2; i++) {
        myFunction(myProducts[productLoop(pos, myProducts.length) + i]);
    }
}

function myFunction(item) {
    const newDiv = document.createElement("div");
    newDiv.className = "col-sm-6";
    newDiv.innerHTML = '<div class="card mx-auto border-light mb-3 " style="width: 18rem;"><div class="image"><img src="img/coffee/' + item.img + '.png" class="card-img-top" alt="..."></img><div class="image__overlay image__overlay--blur"><div class=" image__title">' + item.name + '</div><a href="product.html?' + item.img + '" class="image__description" style="color:white;">More Info</a></div></div><div class="card-body"><h5 class="card-title">' + item.name + '</h5><div class="price"><div class="row"><div class="col"><p class="card-text">&#xa3 ' + item.price + '</p></div><div class="col buynow"><button type="button" class="btn btn-outline-dark">Add</button></div></div></div></div></div></div>';
    console.log(item);
    productContainer.appendChild(newDiv);
}

function productLoop(itemNumber, numberOfProducts) {

    if (itemNumber == numberOfProducts - 2) { return 0; } else if (itemNumber == numberOfProducts - 1) { return 1; } else if (itemNumber == numberOfProducts) { return 2; } else { return itemNumber; }
}