'use strict';


/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const menuToggleBtn = document.querySelector("[data-menu-toggle-btn]");

menuToggleBtn.addEventListener("click", function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
});

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    menuToggleBtn.classList.toggle("active");
  });
}

document.querySelector('.fa-search').addEventListener('click', function() {
    const searchItem = document.querySelector('.search-item');
    searchItem.classList.toggle('active'); // Toggle active class to show/hide input field
  });
  

/**
 * Header Sticky & Back to Top
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
    if (window.scrollY >= 100) {
        header.classList.add("active");
        backTopBtn.classList.add("active");
    } else {
        header.classList.remove("active");
        backTopBtn.classList.remove("active");
    }
});
let cart = [];
let totalPrice = 0;
let discount = 0;

// Add item to cart
function addToCart(itemName, itemPrice, itemDiscount, itemImage) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    const finalPrice = itemPrice - (itemPrice * itemDiscount); // Final price after discount

    if (itemIndex >= 0) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ name: itemName, price: finalPrice, discount: itemDiscount * itemPrice, quantity: 1, image: itemImage });
    }

    updateCart();
    updateCartNotification();

    const cartIcon = document.getElementById('cart-icon');
    cartIcon.classList.add('cart-animated');
    setTimeout(() => cartIcon.classList.remove('cart-animated'), 500);

    saveCartToLocalStorage();
}

// Update the cart
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const originalPrice = item.price + item.discount; // Calculate original price
        const discountedTotalPrice = item.price * item.quantity; // Total price after discount

        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" style="width: 50px; height: 50px; margin-right: 10px;">
            ${item.name} - Original Price: $${originalPrice.toFixed(2)}, Discounted Price: $${discountedTotalPrice.toFixed(2)} 
            <div class="item-quantity-controls">
                <button class="minus-btn" onclick="changeItemQuantity(${index}, 'decrease')">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="plus-btn" onclick="changeItemQuantity(${index}, 'increase')">+</button>
            </div>
        `;
        cartItems.appendChild(li);
    });

    totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Change item quantity in cart
function changeItemQuantity(index, action) {
    if (action === 'increase') {
        cart[index].quantity += 1;
    } else if (action === 'decrease') {
        cart[index].quantity -= 1;
        if (cart[index].quantity === 0) {
            cart.splice(index, 1);
        }
    }
    updateCart();
    updateCartNotification();
    saveCartToLocalStorage();
}

// Update cart notification
function updateCartNotification() {
    const cartNotification = document.getElementById('cart-notification');
    cartNotification.textContent = cart.length;
}

// Save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from local storage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart.push(...JSON.parse(savedCart));
        updateCart();
        updateCartNotification();
    }
}

// Checkout and show payment section
function checkout() {
    const confirmCheckout = confirm('Are you sure you want to proceed to payment?');
    if (confirmCheckout) {
        document.getElementById('cart-modal').style.display = 'none';
        document.getElementById('payment-section').style.display = 'block';
    }
}

// Handle payment submission
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const deliveryFee = getDeliveryFee();
    const taxRate = 0.1; // VAT rate (10%)
    const email = document.getElementById('email').value; // Get email from the form

    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    document.getElementById('spinner').style.display = 'block';
    document.getElementById('payment-form').style.display = 'none'; // Hide payment form
    document.getElementById('progress').style.width = '70%'; // Update progress bar

    setTimeout(() => {
        // Show receipt
        const receiptItems = document.getElementById('receipt-items');
        receiptItems.innerHTML = '';

        let totalBeforeTax = 0;

        // Populate receipt with cart items
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${(item.price * item.quantity).toFixed(2)} (Quantity: ${item.quantity})`;
            receiptItems.appendChild(li);
            totalBeforeTax += item.price * item.quantity;
        });

        const taxAmount = totalBeforeTax * taxRate;
        const discountedTotal = totalBeforeTax - discount;
        const totalAmount = discountedTotal + taxAmount + deliveryFee;

        document.getElementById('tax-rate').textContent = `VAT: $${taxAmount.toFixed(2)} (10%)`;
        document.getElementById('delivery-fee').textContent = `Delivery Fee: $${deliveryFee.toFixed(2)}`;
        document.getElementById('total-before-tax').textContent = discountedTotal.toFixed(2);
        document.getElementById('total-amount').textContent = totalAmount.toFixed(2);

        // Finalize payment process
        document.getElementById('progress').style.width = '100%'; // Complete progress bar
        alert('Payment Successful! A receipt has been sent to your email.');

        // Clear cart
        cart.length = 0;
        updateCart();
        updateCartNotification();
        document.getElementById('payment-section').style.display = 'none';
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('receipt').style.display = 'block'; // Show the receipt
        saveCartToLocalStorage();
    }, 2000);
});

// Function to get delivery fee based on selected method
function getDeliveryFee() {
    const deliveryOptions = document.getElementById('delivery-options');
    const selectedFee = parseFloat(deliveryOptions.value);
    return selectedFee;
}

// Function to apply discount code
function applyDiscount() {
    const discountCode = document.getElementById('discount-code').value;
    const discountFeedback = document.getElementById('discount-feedback');
    
    // Example: Apply a discount of 15% for code "SAVE15"
    if (discountCode === "SAVE15") {
        discount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.15;
        discountFeedback.textContent = `Discount Applied: -$${discount.toFixed(2)}`;
    } else {
        discount = 0;
        discountFeedback.textContent = "Invalid Code";
    }
}

// Close payment section and reset form
function closePaymentSection() {
    document.getElementById('payment-section').style.display = 'none';
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('payment-form').style.display = 'block'; // Show the payment form again
}

// Load cart on window load
window.addEventListener('load', loadCartFromLocalStorage);

// Cart modal toggle functionality
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');

cartIcon.addEventListener('click', () => {
    cartModal.style.display = (cartModal.style.display === 'none' || cartModal.style.display === '') ? 'block' : 'none';
});



// Example: Show the spinner after 1 second
setTimeout(showSpinner, 1000);


// Close button for payment section
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', closePaymentSection);
}


/**
 * Video Autoplay Functionality
 */
function autoplayVideos() {
    const videos = document.querySelectorAll('.autoplay-video');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play();
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.5 });

    videos.forEach(video => {
        observer.observe(video);
        video.addEventListener('ended', function() {
            video.currentTime = 0;
            video.play();
        });
    });
}

window.addEventListener('load', autoplayVideos);

/**
 * Search Functionality and Popup
 */
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const items = document.querySelectorAll('.product');
    const noResultsMessage = document.getElementById('no-results-message');
    let found = false;
  
    items.forEach(item => {
      const itemName = item.querySelector('h3').textContent.toLowerCase();
  
      if (itemName.includes(searchTerm)) {
        found = true;
        item.style.display = 'block';
  
        // Highlight the matched product
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        item.style.backgroundColor = '#f0f0f0';
  
        // Show popup beside search bar
        const popup = document.getElementById('search-popup');
        const popupImage = document.getElementById('popup-image');
        const popupTitle = document.getElementById('popup-title');
        const popupPrice = document.getElementById('popup-price');
  
        popupImage.src = item.querySelector('img').src;
        popupTitle.textContent = item.querySelector('h3').textContent;
        popupPrice.textContent = item.querySelector('p').textContent;
  
        popup.style.display = 'block'; // Show the popup
  
        setTimeout(() => {
          item.style.backgroundColor = ''; // Remove highlight after some time
        }, 1500);
      } else {
        item.style.display = 'none';
      }
    });
  
    if (!found) {
      noResultsMessage.style.display = 'block';
      document.getElementById('search-popup').style.display = 'none'; // Hide popup if no results
    } else {
      noResultsMessage.style.display = 'none';
    }
  }
// Automatically show the login section when the page loads
window.onload = function() {
    openLoginSection(); // Show login form on page load
};

// Smooth Scroll for Back to Top
const backToTopButton = document.querySelector('.back-top-btn');

backToTopButton.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form Validation for Booking Package
const bookingForm = document.querySelector('.footer-form');

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission

  const name = bookingForm.querySelector('input[name="full_name"]').value;
  const email = bookingForm.querySelector('input[name="email_address"]').value;
  const message = bookingForm.querySelector('textarea[name="message"]').value;

  // Basic validation to check if fields are filled
  if (!name || !email || !message) {
    alert('Please fill in all fields.');
    return;
  }

  // If validation passes, you can implement form submission logic here
  alert('Booking request submitted successfully!');
  bookingForm.reset(); // Clear the form after submission
});

// Add event listeners for "Order Now" buttons in banners
const orderButtons = document.querySelectorAll('.banner .btn');

orderButtons.forEach(button => {
  button.addEventListener('click', () => {
    alert('Order placed for this item!');
  });
});

// Blog Read More Functionality
const readMoreButtons = document.querySelectorAll('.btn-link');

readMoreButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Redirecting to the full blog post...');
    // Here you could implement actual redirection if you have a URL
  });
});


document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    showSpinner();

    // Simulate payment processing delay
    setTimeout(function() {
        hideSpinner();
        showReceipt();
    }, 2000);
});

function showSpinner() {
    document.getElementById('spinner').style.display = 'flex';
}


