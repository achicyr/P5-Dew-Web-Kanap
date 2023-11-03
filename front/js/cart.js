// déclaration de la variable "cart" dans laquelle on met
//  les keys et les values qui sont dans le local storage
let products = []

// let cart = localStorage.getItem('products')
// JSON.parse prend une chaine de caractère et la transforme
// en objet ou tableau ou données complexes
let cart = JSON.parse(localStorage.getItem('products'))
// On affiche les produits du panier
if (cart === null) {
  let cart = []
} else {

  const cartItems = document.getElementById('cart__items')

  // On affiche les produits du Local Storage sur la page Cart
  let url = 'http://localhost:3000/api/products/'
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      
      let products = showData(data)
      
      totalPriceQuantity(products)
      changeQuantity(products)
      deleteProducts(products)
    })
  function showData(data) {
    let tab = []
    cart.forEach((productInCart) => {
      const article = document.createElement('article')
      article.className = 'cart__item'
      article.dataset.id = productInCart.id
      article.dataset.color = productInCart.color
      cartItems.appendChild(article)

      //   On crée la div img
      const divImg = document.createElement('div')
      divImg.classList.add('cart__item__img')
      article.appendChild(divImg)

      //  On crée un élément Image
      const image = document.createElement('img')
      divImg.appendChild(image)

      let imageSrc
      data.map((p) => {
        if ((p._id == productInCart.id)) {
          imageSrc = p.imageUrl
        }
      })
      image.src = imageSrc

      let imageAlt
      data.map((p) => {
        if (p._id == productInCart.id) {
          imageAlt = p.altTxt
        }
      })
      image.alt = imageAlt

      //  On crée la div cart __item__content
      const divContent = document.createElement('div')
      divContent.className = 'cart__item__content'
      article.appendChild(divContent)

      //  On crée un élément contentDescription
      const divContentDescription = document.createElement('div')
      divContentDescription.className = 'cart__item__content__description'
      divContent.appendChild(divContentDescription)

      // On crée un élément h2
      const name = document.createElement('h2')
      divContentDescription.appendChild(name)
      name.innerText = data.name

      let nameInnerText
      data.map((p) => {
        if (p._id === productInCart.id) {
          nameInnerText = p.name
        }
      })
      name.innerText = nameInnerText

      // On crée un élément p
      const color = document.createElement('p')
      color.innerText = productInCart.color
      divContentDescription.appendChild(color)

      // On crée un élément p
      const price = document.createElement('p')
      divContentDescription.appendChild(price)
      let priceInnerText
      data.map((p) => {
        if (p._id === productInCart.id) {
          priceInnerText = p.price + '€'
        }
      })
      price.innerText = priceInnerText

      // On crée un élément settings
      const divSettings = document.createElement('div')
      divSettings.className = 'cart__item__content__settings'
      divContent.appendChild(divSettings)

      //On crée un élément quantity
      const divSettingsQuantity = document.createElement('div')
      divSettingsQuantity.className = 'cart__item__content__settings__quantity'
      divSettings.appendChild(divSettingsQuantity)

      // On crée un élément p
      const qte = document.createElement('p')
      qte.textContent = 'Qté : '
      divSettingsQuantity.appendChild(qte)

      // On crée un imput
      const input = document.createElement('input')
      input.type = 'number'
      input.classList.add('itemQuantity')
      input.class = 'itemQuantity'
      input.name = 'itemQuantity'
      input.min = '1'
      input.max = '100'
      input.setAttribute('value', productInCart.quantity)
      divSettingsQuantity.appendChild(input)

      // On crée un élément settingsDelete
      const divSettingsDelete = document.createElement('div')
      divSettingsDelete.className = 'cart__item__content__settings__delete'
      divSettings.appendChild(divSettingsDelete)

      // On crée un élément p
      const buttonDelete = document.createElement('p')
      buttonDelete.className = 'deleteItem'
      buttonDelete.innerText = 'Supprimer'
      divSettingsDelete.appendChild(buttonDelete)

      //..............................................................................
      //..............................................................................

      // On crée la constante product
      const product = {
        id: productInCart.id,
        color: productInCart.color,
        quantity: ('value', productInCart.quantity),
        price: priceInnerText,
        name: nameInnerText,
        image: imageSrc,
        altText: imageAlt,
      }

      //..............................................................................
      //..............................................................................
      tab.push(product)
      console.log(tab.push(product))
    })

    return tab
  }
  // Fin de la fonction, showData(data)
}
//....Fin du else si des produits sont dans le panier.................................
// ...................................................................................

//....................................................................................
//....................................................................................

//....Fonction qui calcule la quantité et le prix des produits du panier..............
//....................................................................................

async function totalPriceQuantity(products) {
  // On déclare les variables avec des valeurs de nombre
  let totalQuantity = 0
  let totalPrice = 0
  // On fait une boucle afin de trouver la quantité
  if (cart.length != 0) {
    for (let j = 0; j < cart.length; j++) {
      const product = products.find((item_, i) => cart[j].id == item_.id)
      let item = cart[j]
      // On met en place un opérateur qui calcule la quantité
      totalQuantity += parseInt(item.quantity)
      // On met en place un opérateur qui calcule le prix total
      totalPrice += parseInt(item.quantity) * parseInt(product.price)
    }
  }
  // On cible l'élément qui affiche la quantitée
  document.getElementById('totalQuantity').innerHTML = totalQuantity
  // On cible l'élément qui affiche le prix
  document.getElementById('totalPrice').innerHTML = totalPrice
}
// Fin de la fonction totalPriceQuantity(products)

//....................................................................................
//....................................................................................

//....Fonction qui modifie la quantité................................................
//....................................................................................

function changeQuantity(products) {
  // On pointe le produit
  const changedQuantity = document.getElementsByClassName('itemQuantity')
  // On fait une boucle pour modifier la quantité des produits
  for (let j = 0; j < changedQuantity.length; j++) {
    changedQuantity[j].addEventListener('change', function (event) {
      // On empêche l’action par défaut liée au clic sur le bouton
      event.preventDefault()
      // ParseInt permet de changer un nombre en string
      // On met à jour la quantité
      cart[j].quantity = parseInt(event.target.value)
      // On controle si la quantité est supérieure à 0 et inférieure à 100
      if (cart[j].quantity < 0 || cart[j].quantity > 100) {
        alert('Veuillez sélectionner une quantité comprise entre 1 et 100')
        window.location.reload()
      } else {
        // On envoie les nouvelles données dans le localStorage
        localStorage.setItem('products', JSON.stringify(cart))
        // On met le prix et la quantité à jour
        totalPriceQuantity(products)
      }
    })
  }
}
// Fin de la fonction, changeQuantity()

//....................................................................................
//....................................................................................

//....Fonction qui supprime un produit................................................
//....................................................................................

function deleteProducts(product) {
  // On pointe l'article
  const deleteItem = document.getElementsByClassName('deleteItem')
  // On prend en compte le click sur l'article
  for (let d = 0; d < deleteItem.length; d++) {
    // On prend en compte le click sur l'article
    deleteItem[d].addEventListener('click', (event) => {
      event.preventDefault()
      // On récupère l'id de article
      const productInCartId = event.target
        .closest('article')
        .getAttribute('data-id')
      //  On récupère la couleur de l'article
      const productInCartColor = event.target
        .closest('article')
        .getAttribute('data-color')

      // On enregistre l'id et la couleur séléctionnée par le bouton "Supprimer"
      cart = cart
        .filter(
          (element) =>
            element.id !== productInCartId ||
            element.color !== productInCartColor
        )

      // On supprime l' article
        event.target.closest('article').remove()
      
      // On envoie les nouvelles données dans le localStorage
      localStorage.setItem('products', JSON.stringify(cart))

      // On met le prix et la quantité à jour
      totalPriceQuantity(product)
    })
  }
}
// Fin de la fonction, deleteProducts(products)

// ...................................................................................
// ...................................................................................

//....Fonction de validation du formulaire............................................
//....................................................................................

//On envoi le formulaire dans le serveur
function postForm() {
  const order = document.getElementById('order')
  document.querySelector('.cart__order__form')
  .addEventListener('submit', (event) => {
    event.preventDefault()

    //On récupère les données du formulaire dans un objet
    const contact = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      email: document.getElementById('email').value,
    }

    // On crée des variables de test
    const communeRegex = /^[a-zA-ZéèêëàâäôöîïùûüçÉÈÊËÀÂÄÔÖÎÏÙÛÜÇ\s-]+$/
    const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/

    // On contrôle la validation des entrées de contact

    //On contrôle le prénom
    function controlFirstName() {
      const okFirstName = contact.firstName
      if (communeRegex.test(okFirstName)) {
        firstNameErrorMsg.innerText = ""
        return true
      }
      else {
        let firstNameErrorMsg = document.getElementById('firstNameErrorMsg')
        firstNameErrorMsg.innerText = "problème"
        // alert((firstNameErrorMsg = 'Prénom. Erreur'))
        return false
      }
    }
console .log(firstNameErrorMsg)
    // On contrôle le nom
    function controlName() {
      const okName = contact.lastName
      if (communeRegex.test(okName)) {
        return true
      }
      else {
        let lastNameErrorMsg = document.getElementById('lastNameErrorMsg')
        alert((lastNameErrorMsg = 'Nom. Erreur'))
        return false
      }
    }

    // On contrôle l' adresse
    function controlAddress() {
      const okAddress = contact.address
      if (addressRegex.test(okAddress)) {
        return true
      }
      else {
        let addressErrorMsg = document.getElementById('addressErrorMsg')
        alert((addressErrorMsg = 'Adresse. Erreur'))
        return false
      }
    }

    // On contrôle la ville
    function controlCity() {
      const okAddress = contact.city
      if (communeRegex.test(okAddress)) {
        return true
      }
      else {
        let cityErrorMsg = document.getElementById('cityErrorMsg')
        alert((cityErrorMsg = 'Ville. Erreur'))
        return false
      }
    }
console.log(cityErrorMsg)
    // On contrôle l' email
    function controlEmail() {
      const okEmail = contact.email
      if (emailRegex.test(okEmail)) {
        return true
      }
            else {
              let = emailErrorMsg = document.getElementById('emailErrorMsg')
              alert((emailErrorMsg = 'Email. Erreur'))
              return false
            }
    }

    // On contrôle que les entrées de contact soient correctes
    function okControl() {
      if (
        controlFirstName() &&
        controlName() &&
        controlAddress() &&
        controlCity() &&
        controlEmail()
      )
      {
        // On envoie l'objet contact dans le local storage
        localStorage.setItem('contact', JSON.stringify(contact))
        return true
      }
      // else {
      // //   alert('Merci de vérifier les données du formulaire')
      // }
    }
    
    if (cart) {
      // On crée un tableau avec les id des produits de la commande
      let products = []
      for (let p of cart) {
        products.push(p.id)
      }

      // On met les valeurs du formulaire et les
      // produits sélectionnés dans un objet qui contient contact et products
      const sendFormData = {
        contact,
        products,
      }

      // clef contenant les contacts et les produits
      console.log(sendFormData)

      // On envoie le formulaire + localStorage (sendFormData),
      // au serveur avec la méthode POST
      const options = {
        method: 'POST',
        body: JSON.stringify(sendFormData),
        headers: {
          'Content-Type': 'application/json'
        }
      }

      fetch('http://localhost:3000/api/products/order', options)
        .then((response) => response.json())

        .then((data) => {
          localStorage.setItem('orderId', data.orderId)
          if (okControl()) {
            document.location.href = 'confirmation.html?id=' + data.orderId
          }
        })
    }
  })
}
// fin de la fonction postForm()
postForm()

// ...................................................................................
// ...................................................................................
