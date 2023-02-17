const url = 'https://fakestoreapi.com/products?limit=3'
const body = document.querySelector('body')
const modalform = document.forms['modalform']
const basket = document.querySelector('.basket')
const market = document.querySelector('.market')
const delinfo = document.querySelector('.delinfo')
const sendinfo = document.querySelector('.sendinfo')
const inputinfo = document.querySelector('.inputinfo')
const btnmarket = document.querySelector('.btnmarket')
const modalback = document.querySelector('.modalback')
const modalimage = document.querySelector('.modalimage')
const modalprice = document.querySelector('.modalprice')
const modaltitle = document.querySelector('.modaltitle')
const modalwindow = document.querySelector('.modalwindow')
const modalbtndel = document.querySelector('.modalbtndel')
const modalbtnadd = document.querySelector('.modalbtnadd')

const arrMarketCards = []


// 1. ФУНКЦИЯ КОТОРАЯ ПОЛУЧАЕТ ИНФОРМАЦИЮ ПО URL и возвращает строку 
const postData = async (url, method, data) => {
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  return await response.json()
}



// 2. КЛАСС СОЗДАНИЯ КАРТОЧКИ
class MarketCard {
  elem = document.createElement('div')
  constructor(id, image, title, price, child) {
    this.id = id
    this.title = title
    this.image = image
    this.price = price
    this.child = child
  }
  addCard() {
    this.elem.classList.add('marketCard')
    this.elem.innerHTML = `
    <h2>Card №${this.id}</h2>
    <img class ='imgsize' src='${this.image}'/> 
    <p>${this.title}</p>
    <p>${this.price} USD</p>
    <button>Добавить в корзину</button>
    `
    market.append(this.elem)
    this.elem
      .querySelector('button')
      .addEventListener('click', this.addbasketCard.bind(this))
  }
  addbasketCard() {
    this.child.active()
    this.child.add === 'false' ? this.child.append() : false
  }
}



// 3. КЛАСС СОЗДАНИЯ КОРЗИНЫ
class BasketCard {
  elem = document.createElement('div')
  constructor(id, count, price) {
    this.id = id
    this.count = count
    this.price = price
    this.add = 'false'
  }
  active() {
    this.elem.classList.add('basket_card')
    this.elem.innerHTML = `
    <h2>Card№ ${this.id}</h2>
    <button class ='btn_minus'>-</button> 
    <p class='basket_count'>${this.count}</p>
    <button class ='btn_plus'>+</button> 
    <p class ='basket_price'>${this.price * this.count} USD</p>
    `
    const btnMinus = this.elem.querySelector('.btn_minus')
    const btnPlus = this.elem.querySelector('.btn_plus')
    btnMinus.addEventListener('click', this.btnMinus.bind(this))
    btnPlus.addEventListener('click', this.addPrice.bind(this))
  }
  basketCarDel() {
    this.elem.remove()
    this.add = 'false'
  }
  append() {
    basket.append(this.elem)
    this.add = 'true'
  }
  addPrice() {
    this.count++
    this.active()
  }
  btnMinus() {
    this.count < 2 ? this.basketCarDel() : this.count--
    this.active()
  }
}



// 4. ДОБАВЛЕНИЕ ВСЕХ ПРОДУКТОВ ИЗ КОРЗИНЫ В localStorage
sendinfo.addEventListener('click', () => {
  getProduct()
})
const getProduct = () => {
  let arrInfoServ = []
  const arrSendServ = Array.from(document.querySelectorAll('.basket_card'))
  const arrВetail = Array.from(document.querySelector('.basket_card').children)

  for (let i = 0; i < arrSendServ.length; i++) {
    const obj = {}
    for (let j = 0; j < arrSendServ[i].children.length; j++) {
      obj[arrВetail[j].innerText] = arrSendServ[i].children[j].innerText
    }
    arrInfoServ.push(obj)
  }
  postData(url, 'POST', arrInfoServ).then((response) =>
    console.log('response', response)
  )
  console.log('JSON.stringify(arrInfoServ)', JSON.stringify(arrInfoServ))
  localStorage.setItem('data', JSON.stringify(arrInfoServ))
  return arrInfoServ
}
delinfo.addEventListener('click', () => localStorage.clear())




//  5. ДОБАВЛЕНИЕ НОВОГО ПРОДУКТА В Basket
const addProductCard = () => {
  const randomNum = Math.floor(Math.random() * 100)
  const elements = Array.from(modalform.elements)
    .filter((el) => el.tagName !== 'BUTTON')
    .map((el) => el.value)
  const objBasket = new BasketCard(elements[0], 1, randomNum)
  const objMarcet = new MarketCard(...elements, objBasket)
  objMarcet.addCard()
  arrMarketCards.push(objMarcet)
  onSubmitHandler()
  setLocalStorage(arrMarketCards)
}
modalbtnadd.addEventListener('click', () => {
  addProductCard()
})
modalbtndel.addEventListener('click', () => {
  onSubmitHandler()
})
btnmarket.addEventListener('click', () => {
  addcardmodal()
})

const onSubmitHandler = () => {
  modalwindow.remove()
  modalback.remove()
}
const addcardmodal = () => {
  body.append(modalback)
  body.append(modalwindow)
  modalwindow.style.zIndex = 999
  modalback.style.display = 'block'
}


// 6. Render
const render = (data) => {
  if (localStorage.getItem('data')) {
    const localdata = JSON.parse(localStorage.getItem('data'))
    localdata.map((el) => {
      const values = Object.values(el)
      console.log('values', values)
      const obj = new BasketCard(
        values[1].slice(-1),
        values[0],
        values[4].slice(0, -3) / values[0]
      )
      obj.active()
      obj.append()
    })
  }

  data.map((item) => {
    const randomNum = Math.floor(Math.random() * 100)
    const obj = new BasketCard(item.id, 1, randomNum)

    const objMarcet = new MarketCard(
      item.id,
      item.image,
      item.title,
      randomNum,
      obj
    )
    objMarcet.addCard()
    arrMarketCards.push(objMarcet)
  })
}

// 7. ВЫЗОВ ФУНКЦИИ GET ЗАПРОСА
const local = JSON.parse(localStorage.getItem('marketData'))

local
  ? render(local)
  : postData(url, 'GET').then((data) => {
      render(data)
    })

const setLocalStorage = (arr) => {
  localStorage.setItem('marketData', JSON.stringify(arr))
}
