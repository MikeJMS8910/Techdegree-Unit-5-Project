let peoplesArray = []
let added = 0;

function addToHTML() {
    for(x = 0; x < peoplesArray.length; x++) {
        let newCard = `
        <div class="card" id="${x}">
            <div class="card-img-container">
                <img class="card-img" src="${peoplesArray[x].picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${peoplesArray[x].name.first+" "+peoplesArray[x].name.last}</h3>
                <p class="card-text">${peoplesArray[x].email}</p>
                <p class="card-text cap">${peoplesArray[x].location.city+", "+peoplesArray[x].location.state}</p>
            </div>
        </div>`

        document.getElementById("gallery").innerHTML += newCard;
    }
}


fetch('https://randomuser.me/api/?results=12')
    .then(response => response.json())
    .then(data => {
        peoplesArray = data.results
        addToHTML()
    })
    .catch(error => console.error("Error - "+error))


function getPlace(card) {
    let cardDiv = null

    if(card.nodeName == "H3") {
        cardDiv = card.parentNode.parentNode
    }else if(card.nodeName == "P") {
        cardDiv = card.parentNode.parentNode
    }else if(card.nodeName == "IMG") {
        cardDiv = card.parentNode.parentNode
    } else if(card.nodeName == "DIV") {
        if(card.className == "card") {
            cardDiv = card
        } else {
            cardDiv = card.parentNode
        }
    }

    for(let x = 0; x < document.getElementById("gallery").childNodes.length; x++) {
        if(document.getElementById("gallery").querySelectorAll(".card")[x].id == cardDiv.id) {
            return peoplesArray[x]
        }
    }
}

function getNumber(data) {
    let array = data.split("")
    for(x = 0; x < array.length; x++) {
        if(array[x] == "-" || array[x] == " " || array[x] == "(" || array[x] == ")") {
            index = x
            delete array[x]+", "
        }
    }

    let filtered = array.filter(function (el) {
        return el !== null;
    });

    if(filtered.length == 10) {
        return "("+filtered[0]+filtered[1]+filtered[2]+") "+filtered[3]+filtered[4]+filtered[5]+"-"+filtered[6]+filtered[7]+filtered[8]+filtered[9]
    } else {
        console.error("The length of the phone number was "+filtered.length+" not 10")
        return "Phone Number not Avalible"
    }
    
}

function getDate(data) {
    let newData = data.split("T")
    let index = 1
    newData.splice(index, 1)
    let newestData = newData[0].split("-")
    return newestData[1]+"/"+newestData[2]+"/"+newestData[0]
}

function addListener() {
    document.getElementById("gallery").childNodes.forEach(item => {
        item.addEventListener("click", function(e) {
            let specificInfo = getPlace(e.target)
            console.log(specificInfo)

            let newBox = `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${specificInfo.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${specificInfo.name.first+" "+specificInfo.name.last}</h3>
                        <p class="modal-text">${specificInfo.email}</p>
                        <p class="modal-text cap">${specificInfo.location.city}</p>
                        <hr>
                        <p class="modal-text">${getNumber(specificInfo.cell)}</p>
                        <p class="modal-text">${specificInfo.location.street.number+" "+specificInfo.location.street.name+", "+specificInfo.location.city+", "+specificInfo.location.state+", "+specificInfo.location.postcode}</p>
                        <p class="modal-text">Birthday: ${getDate(specificInfo.dob.date)}</p>
                    </div>
                </div>
            </div>`

            document.querySelector("body").innerHTML += newBox
            document.getElementById("modal-close-btn").addEventListener("click", (e) => {
                document.querySelector(".modal-container").remove()
            });

            addListener()
        });
    });
}

setTimeout(function(){ addListener() }, 2000)