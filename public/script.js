const getFruits = async() => {
    try {
        return (await fetch("api/fruits/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showFruits = async() => {
    let fruits = await getFruits();
    let fruitsDiv = document.getElementById("fruit-list");
    fruitsDiv.innerHTML = "";
    fruits.forEach((fruit) => {
        const section = document.createElement("section");
        section.classList.add("fruit");
        fruitsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = fruit.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(fruit);
        };
    });
};

const displayDetails = (fruit) => {
    const fruitDetails = document.getElementById("fruit-details");
    fruitDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = fruit.name;
    fruitDetails.append(h3);

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    fruitDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    fruitDetails.append(eLink);
    eLink.id = "edit-link";

    const p = document.createElement("p");
    fruitDetails.append(p);
    p.innerHTML = `<strong>Color</strong>: ${fruit.color}`;

    const p2 = document.createElement("p");
    fruitDetails.append(p2);
    p2.innerHTML = `<strong>Taste</strong>: ${fruit.taste}`;

    const p3 = document.createElement("p");
    fruitDetails.append(p3);
    p3.innerHTML = `<strong>Size</strong>: ${fruit.size}`;

    const p4 = document.createElement("p");
    fruitDetails.append(p4);
    p4.innerHTML = `<strong>Origin</strong>: ${fruit.origin}`;

    const p5 = document.createElement("p");
    fruitDetails.append(p5);
    p5.innerHTML = `<strong>Related Info</strong>:`;
    const ul = document.createElement("ul");
    fruitDetails.append(ul);
    console.log(fruit.related_infos);
    fruit.related_infos.forEach((related_info) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = related_info;
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("ae-title").innerHTML = "Edit Fruit";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
    };

    populateEditForm(fruit);
};

const resetForm = () => {
    const form = document.getElementById("ae-fruit-form");
    form.reset();
    form._id = "-1";
    document.getElementById("related_info-boxes").innerHTML = "";
};

const addEditFruit = async(e) => {
    e.preventDefault();
    const form = document.getElementById("ae-fruit-form");
    const formData = new FormData(form);
    let response;
    if (form._id.value == -1) {
        formData.delete("_id");
        formData.delete("img");
        formData.delete("name");
        formData.delete("color");
        formData.delete("taste");
        formData.delete("size");
        formData.delete("origin");
        formData.append("related_infos", getRelatedInfos());

        console.log(...formData);

        response = await fetch("/api/fruits", {
            method: "POST",
            body: formData
        });
    }
    if (response.status != 200) {
        console.log("Error posting data");
    }

    response = await response.json();
    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showFruits();
};

const getRelatedInfos = () => {
    const inputs = document.querySelectorAll("#related_info-boxes input");
    let related_infos = [];
    inputs.forEach((input) => {
        related_infos.push(input.value);
    });
    return related_infos;
}

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("ae-title").innerHTML = "Add Fruit";
    resetForm();
};

const addRelatedInfo = (e) => {
    e.preventDefault();
    const section = document.getElementById("related_info-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

window.onload = () => {
    showFruits();
    document.getElementById("ae-fruit-form").onsubmit = addEditFruit;
    document.getElementById("add-link").onclick = showHideAdd;
    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };
    document.getElementById("add-related_info").onclick = addRelatedInfo;
};