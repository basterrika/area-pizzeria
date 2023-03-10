import $data from "../../pizzas.json" assert { type: "json" };
console.log($data);

let $masasHTML = document.getElementById('masas');
let $masas = $data.masas;
Object.keys($masas).forEach(key => {
    let $masa = $masas[key];

    let input = document.createElement("input");
    input.type = 'radio';
    input.name = 'masa';
    input.id = key;
    input.value = key;
    input.label = $masa.label;
    $masasHTML.append(input);

    let label = document.createElement("label");
    label.htmlFor = key;
    label.innerText = $masa.label;
    $masasHTML.append(label);

    if (key === 'fina') {
        input.checked = true;
    }
});

let $ingredientesHTML = document.getElementById('ingredientes');
let $ingredientes = $data.ingredientes;
Object.keys($ingredientes).forEach(key => {
    let $ingrediente = $ingredientes[key];

    let input = document.createElement("input");
    input.type = 'checkbox';
    input.name = 'ingredientes[]';
    input.id = key;
    input.value = key;
    input.label = $ingrediente.label;

    $ingredientesHTML.append(input);

    let label = document.createElement("label");
    label.innerText = $ingrediente.label;
    label.htmlFor = key;
    $ingredientesHTML.append(label);

    let thumbnail = document.createElement("img");
    thumbnail.src = $ingrediente.thumbnail;
    thumbnail.classList.add('thumbnail');

    label.prepend(thumbnail);
});

let $bebidasHTML = document.getElementById('bebidas');
let $bebidas = $data.bebidas;
Object.keys($bebidas).forEach(key => {
    let $bebida = $bebidas[key];

    let input = document.createElement("input");
    input.type = 'radio';
    input.name = 'bebida';
    input.id = key;
    input.value = key;
    input.label = $bebida.label;
    $bebidasHTML.append(input);

    let label = document.createElement("label");
    label.htmlFor = key;
    label.innerText = $bebida.label;
    $bebidasHTML.append(label);

    if ($bebida.thumbnail) {
        let thumbnail = document.createElement("img");
        thumbnail.src = $bebida.thumbnail;
        thumbnail.classList.add('thumbnail');
        label.prepend(thumbnail);
    }

    if (key === 'nada') {
        input.checked = true;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    let $precio_inicial = 0;

    // Select saved value
    let savedMasa = localStorage.getItem('masa') || '';
    if (savedMasa) {
        document.querySelector(`input[name="masa"][value="${savedMasa}"]`).checked = true;
        $precio_inicial += $masas[savedMasa].price;
    }

    // Check saved values
    let savedIngredientes = localStorage.getItem('ingredientes') ? localStorage.getItem('ingredientes').split(',') : [];
    savedIngredientes.forEach(ingredient => {
        document.querySelector(`input[name="ingredientes[]"][value="${ingredient}"]`).checked = true;
        $precio_inicial += $ingredientes[ingredient].price;

        let img = document.createElement("img");
        img.src = $ingredientes[ingredient].img;
        img.classList.add('ingrediente');
        document.getElementById('foto-base').before(img);
    });

    document.getElementById('total-precio').innerHTML = `${$precio_inicial}€`;

    // Gestionar la masa de la pizza
    const radios = document.querySelectorAll('input[name="masa"]');
    radios.forEach(radio => {
        radio.addEventListener('click', function () {
            document.getElementById('foto-base').src = $masas[radio.value].img;
            localStorage.setItem('masa', radio.value);
        });
    });

    // gestionar ingredientes
    document.addEventListener('click', function () {
        let saveCheckboxes = [];
        let checkedBoxes = document.querySelectorAll('input[name="ingredientes[]"]:checked');

        // Elimina todas las fotos de ingredientes
        const $img_ingredientes = document.getElementsByClassName('ingrediente');
        while($img_ingredientes.length > 0){
            $img_ingredientes[0].parentNode.removeChild($img_ingredientes[0]);
        }

        checkedBoxes.forEach(checkbox => {
            saveCheckboxes.push(checkbox.value);

            let img = document.createElement("img");
            img.src = $ingredientes[checkbox.value].img;
            img.classList.add('ingrediente');
            document.getElementById('foto-base').before(img);
        });

        localStorage.setItem('ingredientes', saveCheckboxes.toString());

        // Actualiza el precio en cada cambio.
        let $precio = $calcular_precio();
        document.getElementById('total-precio').innerHTML = `${$precio}€`;
    });

    // Gestionar bebida
    const bebidas_inputs = document.querySelectorAll('input[name="bebida"]');
    bebidas_inputs.forEach(bebida => {
        bebida.addEventListener('click', function () {
            localStorage.setItem('masa', radio.value);
        });
    });
});

let $calcular_precio = function() {
    let $masa = document.querySelector('input[name="masa"]:checked').value;
    let $masa_precio = $masas[$masa].price;

    let $precio_ingredientes = 0;
    let checkedBoxes = document.querySelectorAll('input[name="ingredientes[]"]:checked');
    if (checkedBoxes.length) {
        checkedBoxes.forEach(checkbox => {
            $precio_ingredientes += $ingredientes[checkbox.value].price;
        });
    }

    let $bebida = document.querySelector('input[name="bebida"]:checked').value;
    let $bebida_precio = $bebidas[$bebida].price;

    return $masa_precio + $precio_ingredientes + $bebida_precio;
}

new StickySidebar('.sticky-wrapper', {
    containerSelector: '.imagenes-wrapper',
    innerWrapperSelector: '.imagenes',
    topSpacing: 100,
});
