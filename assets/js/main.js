// Strict mode turned on
// This is a JavaScript feature that helps catch common coding errors and "unsafe" actions
'use strict';

// Declaration of global variables and SELECTING HTML ELEMENTS
// ************************************************************************//
const cart = document.querySelector('.cart');
const dessertList = document.querySelector('.list__dessert');
const cartList = document.querySelector('.list__cart');
const confirmList = document.querySelector('.list__confirm');
const emptyCart = document.querySelector('.cart__empty');
const cartTotalWrapper = document.querySelector('.cart__total--wrapper');
const cartConfirmWrapper = document.querySelector('.cart__confirm--wrapper');
const cartTotalAmount = document.querySelector('.cart__total--amount');
const cartQuantity = document.querySelector('.cart__quantity--amount');
const confirmTotalAmount = document.querySelector('.confirm__total--amount');
const confirmModal = document.querySelector('.confirm__modal');
const cartConfirmBtn = document.querySelector('.cart__confirm--btn');
const newOrderBtn = document.querySelector('.new-order__btn');
const floatingCart = document.querySelector('.floating__cart');
const floatingDataCount = document.querySelector('[data-count]');
const confirmCloseIcon = document.querySelector('.confirm__modal--x-icon');
const cartCloseBtn = document.querySelector('.cart--x-icon');
const media = window.matchMedia('(max-width: 52.5em)');
// ************************************************************************//

// Set the current year in the footer
// ************************************************************************//
document.querySelector('.current-year').textContent = new Date().getFullYear();
// ************************************************************************//

// Locale currency formatting function
// ************************************************************************//
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
// ************************************************************************//

// Fetch JSON data from a local file and store it in a global variable
// This function uses the Fetch API to retrieve data from a JSON file
// ************************************************************************//
// IIFE (Immediately Invoked Function Expression) to fetch data
// This pattern is used to execute the function immediately after its definition
(async () => {
  try {
    const response = await fetch('./data.json'); //imports JSON data
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); //parses JSON data
    dessertItemGenerator(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
})();
// ************************************************************************//

// Dessert HTML element generator function
// ************************************************************************//
const dessertItemGenerator = (data) => {
  data.forEach((dessert) => {
    dessertList.insertAdjacentHTML(
      'beforeend',
      `<li class="dessert__list__item d-grid">
        <div class="dessert__list__item__badge ">
          <picture class="rounded">
            <source
              media="(max-width: 46.825em)"
              sizes=""
              srcset="${dessert.image.mobile}"
              type="image/jpeg"
            />
            <source
              media="(max-width: 75em)"
              sizes=""
              srcset="${dessert.image.tablet}"
              type="image/jpeg"
            />
            <img
              src="${dessert.image.desktop}"
              alt="${dessert.name}"
              loading="lazy"
              class="rounded dessert__list__item__image"
            />

            <div class="dessert__list__item__action">
              <button type="button" class="d-flex pill btn__add-to-cart">
                <img src="assets/images/icon-add-to-cart.svg" alt="cart icon" aria-label="Add ${
                  dessert.name
                } to cart" class="icon__add-to-cart"/>
                <p class="label__add-to-cart">Add to Cart</p>
              </button>
              <button type="button" class="d-flex pill hidden btn__quantity-adjuster">
                <img
                  src="assets/images/icon-decrement-quantity.svg"
                  alt="decrement button" class="icon__decrement-quantity"
                />
                <label class="sr-only" for="input">
                Input quantity
                </label>
                <input type="number" id="input" value="1" min="1" class="input__quantity-adjuster"/>
                <img
                  src="assets/images/icon-increment-quantity.svg"
                  alt="increment button" class="icon__increment-quantity"
                />
              </button>
              <div
                class="tooltip text-center rounded hidden"
                data-tooltip="Max quantity per item is 99."
              ></div>
            </div>
          </picture>
        </div>
        <div class="dessert__list__item__detail d-grid">
          <h3 class="dessert__list__item__detail--category">${
            dessert.category
          }</h3>
          <h4 class="dessert__list__item__detail--name">${dessert.name}</h4>
          <p class="dessert__list__item__detail--price">Price: ${formatCurrency(
            dessert.price
          )}</p>
        </div>
      </li>
      `
    );
  });
};
// ************************************************************************//

// Cart order HTML element generator function
// ************************************************************************//
const cartItemGenerator = (item) => {
  cartList.insertAdjacentHTML(
    'beforeend',
    `<li class="cart__item d-flex">
      <div class="cart__item--details d-grid">
        <p class="cart__item--name">${item[0].dessertName}</p>
        <div class="cart__item--pricing d-flex">
          <p class="cart__item--quantity">${item[0].quantity}x</p>
          <p class="cart__item--unit-price">@ ${formatCurrency(
            item[0].dessertPrice
          )}</p>
          <p class="cart__item--unit-total">${formatCurrency(
            item[0].dessertPrice
          )}</p>
        </div>
      </div>
      <button type="button" class="cart__item--remove__btn d-flex">
        <img
          src="assets/images/icon-remove-item.svg"
          alt="remove item icon"
          class="remove--x-icon x-icon"
        />
      </button>
    </li>`
  );
};
// ************************************************************************//

// Confirm order HTML element generator function
// ************************************************************************//
const confirmItemGenerator = (item) => {
  const thumbnail = item[0].dessertCategory
    .split(' ')
    .map((word) => word.split(''))
    .map(
      (letter) =>
        letter[0].toLowerCase() + letter.slice(1, letter.length).join('')
    )
    .join('-');

  confirmList.insertAdjacentHTML(
    'beforeend',
    `<li class="confirm__item d-flex">
      <img
        src="assets/images/image-${thumbnail}-thumbnail.jpg"
        alt=""
        class="confirm__image rounded"
      />
      <div class="confirm__detail d-grid">
        <p class="confirm__detail--name">${item[0].dessertName}</p>
        <div class="d-flex">
          <p class="confirm__detail--quantity">1x</p>
          <p class="confirm__detail--price">@ ${formatCurrency(
            item[0].dessertPrice
          )}</p>
        </div>
      </div>
      <p class="confirm__detail--unit-total">${formatCurrency(
        item[0].dessertPrice
      )}</p>
    </li>`
  );
};
// ************************************************************************//

// Encapsulation of key function
// ************************************************************************//
const cartAction = {
  // This array stores clicked dessert details {name, category, price, initQty}
  cartArray: [],
  //This function adds item to cart
  addToCart(item) {
    cartItemGenerator(item);
    confirmItemGenerator(item);
  },
  // This function updates the cart values -- Unit Qty, Unit Total, Order Qty, Order Total
  updateCart(order) {
    // Get all the orders existing in the cart
    const cartItems = document.querySelectorAll('.cart__item--name');

    // Get all the orders existing in the confirm modal
    const confirmItems = document.querySelectorAll('.confirm__detail--name');

    // Calculate and display the total quantity of items in the cart
    floatingDataCount.dataset.count = cartQuantity.innerText =
      this.cartArray.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0);

    // Calculate and display the total price of all items in the cart
    confirmTotalAmount.innerText = cartTotalAmount.innerText = formatCurrency(
      this.cartArray.reduce((acc, item) => {
        return acc + item.dessertPrice * item.quantity;
      }, 0)
    );

    // Find the active order
    // Order equivalent to where the adjustment action is taking place
    if (order) {
      const cartItemToAdjust = [...cartItems].find(
        (item) => item.innerText === order.dessertName
      );

      // Adjust the active order quantity
      cartItemToAdjust.nextElementSibling.querySelector(
        '.cart__item--quantity'
      ).innerText = `${order.quantity}x`;

      // Get confirm item to adjust
      const confirmItemToAdjust = [...confirmItems].find(
        (item) => item.innerText === order.dessertName
      );

      // Adjust the active order unit total
      confirmItemToAdjust.parentElement.nextElementSibling.innerText =
        cartItemToAdjust.nextElementSibling.querySelector(
          '.cart__item--unit-total'
        ).innerText = formatCurrency(order.quantity * order.dessertPrice);

      // Adjust the active order quantity
      confirmItemToAdjust.nextElementSibling.querySelector(
        '.confirm__detail--quantity'
      ).innerText = `${order.quantity}x`;
    }
  },

  // This function remove an item in the cart
  removeOrder(event) {
    // Check if the remove icon is being clicked
    // Get the particular item--remove__icon clicked
    if (event.target?.matches('.remove--x-icon')) {
      const itemToRemove = event.target?.closest('button').parentElement;

      // Get the name of the item to be removed
      const itemToRemoveName =
        itemToRemove.querySelector('.cart__item--name').innerText;

      // Find the index of the item in the cartArray
      const index = this.cartArray.findIndex(
        (item) => item.dessertName === itemToRemoveName
      );

      // Remove the item from the cartArray using the index
      this.cartArray.splice(index, 1);

      // Remove the item from the cart list
      cartList.removeChild(itemToRemove); // remove the li

      // Find the item in the dessert list and restore its default state
      const dessertItemName = document.querySelectorAll(
        '.dessert__list__item__detail--name'
      );
      const dessertCard = [...dessertItemName].find(
        (dess) => dess.innerText === itemToRemoveName
      ).parentElement.parentElement;

      // Restore default styling
      dessertCard.querySelector('.btn__add-to-cart').classList.remove('hidden');
      dessertCard
        .querySelector('.btn__quantity-adjuster')
        .classList.add('hidden');
      dessertCard.querySelector('picture').classList.remove('selected');
      dessertCard.querySelector('.input__quantity-adjuster').value = 1;

      // Check if the cart have items
      if (cartList.children.length < 1) {
        // If cart is empty display empty cart icon and remove total
        emptyCart.classList.remove('hidden');
        cartTotalWrapper.classList.add('hidden');
        cartConfirmWrapper.classList.add('hidden');
      }

      // Update the cart values
      this.updateCart();
    }
  },
  // This function starts a new order after resetting the entire program to default
  startNewOrder() {
    cartList.replaceChildren();
    confirmList.replaceChildren();
    this.cartArray.length = 0;
    emptyCart.classList.remove('hidden');
    cartTotalWrapper.classList.add('hidden');
    cartConfirmWrapper.classList.add('hidden');
    dessertList.querySelectorAll('picture').forEach((pic) => {
      pic.classList.contains('selected') && pic.classList.remove('selected');
    });
    dessertList.querySelectorAll('.btn__add-to-cart').forEach((btn) => {
      if (btn.classList.contains('hidden')) {
        btn.classList.remove('hidden');
        btn.nextElementSibling.classList.add('hidden');
        btn.nextElementSibling.querySelector(
          '.input__quantity-adjuster'
        ).value = 1;
      }
    });

    this.updateCart();
  },
};
// ************************************************************************//

// Delegating all dessert action event to the Dessert List
// ************************************************************************//
dessertList.addEventListener('click', (event) => {
  // Time Out tool tip
  const timeOutTooltip = (input) => {
    const toolTip = input.parentElement.nextElementSibling;
    toolTip.classList.remove('hidden');
    setTimeout(() => {
      toolTip.classList.add('hidden');
    }, 3000);
  };

  // This function finds the dessert item where an action is happening
  const findCartItem = (dessertName) => {
    return cartAction.cartArray.find(
      (item) => item.dessertName === dessertName
    );
  };

  // ADD-TO-CART BUTTON CLICK EVENT
  // Check if the add-to-cart button is being clicked
  if (
    event.target?.matches(
      '.btn__add-to-cart, .icon__add-to-cart, .label__add-to-cart'
    )
  ) {
    // Get the clicked dessert item details
    const dessertItem = event.target?.closest('.dessert__list__item');
    const dessertName = dessertItem.querySelector(
      '.dessert__list__item__detail--name'
    ).textContent;
    const dessertPrice = +dessertItem
      .querySelector('.dessert__list__item__detail--price')
      .textContent.slice(8);
    const dessertCategory = dessertItem.querySelector(
      '.dessert__list__item__detail--category'
    ).textContent;

    // Add selected border UI
    dessertItem.querySelector('picture').classList.add('selected');

    // Push the details obtained above into the cartArray
    cartAction.cartArray.push({
      dessertName,
      dessertPrice,
      dessertCategory,
      quantity: 1,
    });

    // Hide the empty-cart message & image and show the carbon-neutral message and total
    const btnAddToCart = event.target?.closest('button');
    btnAddToCart.classList.add('hidden');
    btnAddToCart.nextElementSibling.classList.remove('hidden');
    emptyCart.classList.add('hidden');
    cartTotalWrapper.classList.remove('hidden');
    cartConfirmWrapper.classList.remove('hidden');

    // Create the ordered cart items as they are clicked
    cartAction.addToCart(cartAction.cartArray.slice(-1));

    // Update the total price of the cart
    cartAction.updateCart();
  }

  // QUANTITY-ADJUSTER BUTTON CLICK EVENT AND INPUT EVENT
  // Check if the quantity-adjuster button input element is being interacted with
  if (
    event.target?.matches(
      '.icon__decrement-quantity, .icon__increment-quantity, .input__quantity-adjuster'
    )
  ) {
    // Get the clicked dessert item details
    const dessertItem = event.target?.closest('.dessert__list__item');
    const dessertName = dessertItem.querySelector(
      '.dessert__list__item__detail--name'
    ).textContent;
    const quantityInput = dessertItem.querySelector(
      '.input__quantity-adjuster'
    );

    // QUANTITY-ADJUSTER BUTTON CLICK EVENT
    // Handle increment and decrement actions
    if (event.target?.matches('.icon__increment-quantity')) {
      // Sets the maximum order quantity per item to 99
      if (+quantityInput.value < 99) {
        quantityInput.value = findCartItem(dessertName).quantity += 1;
        cartAction.updateCart(findCartItem(dessertName));
        if (+quantityInput.value === 99) timeOutTooltip(quantityInput);
      }
    } else if (
      event.target?.matches('.icon__decrement-quantity') &&
      findCartItem(dessertName).quantity > 1
    ) {
      quantityInput.value = findCartItem(dessertName).quantity -= 1;
      cartAction.updateCart(findCartItem(dessertName));
    }

    // QUANTITY-ADJUSTER INPUT CLICK EVENT
    // Check if the input element is being adjusted
    if (event.target?.matches('.input__quantity-adjuster')) {
      // Input listener adjust quantity according to the inputed quantity
      quantityInput.addEventListener('input', () => {
        if (quantityInput.value.length > 2) {
          quantityInput.value = quantityInput.value.slice(0, -1);
          timeOutTooltip(quantityInput);
        }
        findCartItem(dessertName).quantity = +quantityInput.value;
        cartAction.updateCart(findCartItem(dessertName));
      });

      // Blur listener adjust quantity when input loses focus
      quantityInput.addEventListener('blur', (event) => {
        if (event.target.value === '') {
          quantityInput.value = findCartItem(dessertName).quantity = 1;
          cartAction.updateCart(findCartItem(dessertName));
        }
      });
    }
  }
});
// ************************************************************************//

// Button eventListeners
// ************************************************************************//
cartConfirmBtn.addEventListener('click', (event) => {
  event.preventDefault();
  if (media.matches) {
    cart.style.display = 'none';
  }
  confirmModal.showModal();
});

confirmCloseIcon.addEventListener('click', () => {
  confirmModal.close();
  cart.style.display = 'grid';
});

newOrderBtn.addEventListener('click', (event) => {
  event.preventDefault();
  cartAction.startNewOrder();
  confirmModal.close();
  if (media.matches) {
    floatingCart.style.display = 'flex';
  }
});

floatingCart.addEventListener('click', () => {
  cart.style.display = 'grid';
  floatingCart.style.display = 'none';
});

cartCloseBtn.addEventListener('click', () => {
  cart.style.display = 'none';
  floatingCart.style.display = 'flex';
});
// ************************************************************************//

// Delegating all cart action event to the Cart List
// ************************************************************************//
cartList.addEventListener('click', (event) => {
  cartAction.removeOrder(event);
});
// ************************************************************************//
