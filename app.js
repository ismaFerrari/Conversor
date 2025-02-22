'use strict'

//Datos de inputs
const primerDivisa = document.getElementById('primer-divisa')
const segundaDivisa = document.getElementById('segunda-divisa')
const primerValor = document.getElementById('primer-valor')
const segundoValor = document.getElementById('segundo-valor')
const infoDeCambio = document.getElementById('informacion-de-cambio')
const botonConvertir = document.getElementById('convertir')
const botonDeCambio = document.getElementById('taza')
const ul = document.querySelector('.lista-resultados')

//Resultados almacenados
let almacenarEnLocal = [] // <= ARREGLO QUE IRA AL LOCALSTORAGE
let divisa = document.querySelector('.divisa')

function calcular() {
  const primerMonedaIngresada = primerDivisa.value 
  const segundaMonedaIngresada = segundaDivisa.value

  fetch(`https://v6.exchangerate-api.com/v6/fdca511a8ae4e70ce6d7b7f6/latest/${primerMonedaIngresada}`)
  .then(res => res.json())
  .then(data => {
    const taza = data.conversion_rates[segundaMonedaIngresada]
    infoDeCambio.innerHTML = `<b>1 ${primerMonedaIngresada}</b> es igual a: <b>${taza.toFixed(2)} ${segundaMonedaIngresada}</b>`
    segundoValor.value = (primerValor.value * taza).toFixed(2)

    botonConvertir.addEventListener('click', botonClick)
  })
}

function botonClick() { //MOSTRAR CONTENIDO EN EL DOM
  const li = document.createElement('li')
  li.classList = 'lista'
  const agregarEnLista = ul

  li.innerHTML = `La conversión de <b>$${primerValor.value} ${primerDivisa.value}</b> es igual a: <b>$${segundoValor.value} ${segundaDivisa.value}</b>`

  agregarEnLista.appendChild(li)
  li.appendChild(borrarResultados())
  almacenarEnLocal.push(li.innerHTML)

  localStorage.setItem("Conversiones", JSON.stringify(almacenarEnLocal)) // <= ARREGLO ALMACENADO EN EL LOCALSTORAGE
}
  
//EVENTOS
primerDivisa.addEventListener('change', calcular)
segundaDivisa.addEventListener('change', calcular)
primerValor.addEventListener('input', calcular)
segundoValor.addEventListener('input', calcular)
taza.addEventListener('click', () =>{ //BOTON PARA INVERTIR LAS DIVISAS
  const temp = primerDivisa.value
  primerDivisa.value = segundaDivisa.value
  segundaDivisa.value = temp
  calcular()
}) 

calcular()

function borrarResultados() { //ELIMINAR CONTENIDO DEL DOM
  const botonBorrar = document.createElement('button')

  botonBorrar.textContent = 'X'
  botonBorrar.classList = 'boton-borrar'

  botonBorrar.addEventListener('click', (e) => {
    const item = e.target.parentElement
    const borrarDeLista = ul
    borrarDeLista.removeChild(item)

    Toastify({
      text: 'Conversion eliminada',
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      onClick: function(){}
    }).showToast();
  })
  return botonBorrar
}