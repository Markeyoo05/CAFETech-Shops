window.addEventListener("scroll", function () {
        const mainNav = document.querySelector(".main-nav");
        
       
        if (window.scrollY > 50) { 
            mainNav.classList.add("scrolled");
        } else {
            mainNav.classList.remove("scrolled");
        }
    });
function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth" 
        });
    }
function toggleMenu() {
        const slideMenu = document.getElementById('slideMenu');
        slideMenu.classList.toggle('show');
    }
function updatePriceDisplay(price) {
    document.getElementById("priceDisplay").textContent = new Intl.NumberFormat('en-PH').format(price);
}

function updateProductCount() {
    const products = document.querySelectorAll(".Saleproduct");
    const visibleProducts = Array.from(products).filter(product => product.style.display !== "none").length;
    const totalProducts = products.length;
    const resultText = `Showing ${visibleProducts} of ${totalProducts} results`;
    document.querySelector(".product-header span").textContent = resultText;
}


function filterProducts() {
    const maxPrice = document.getElementById("priceFilter").value;
    const products = document.querySelectorAll(".Saleproduct");

    products.forEach(product => {
        const productPrice = parseInt(product.getAttribute("data-price"), 10);
        if (productPrice <= maxPrice) {
            product.style.display = "block"; 
        } else {
            product.style.display = "none"; 
        }
    });

    // Update the product count after filtering
    updateProductCount();
}
let originalOrder = [];

function sortProducts() {
    const sortOption = document.getElementById("sortOptions").value;
    const productGrid = document.querySelector(".product-grid");
    const products = Array.from(document.querySelectorAll(".Saleproduct"));

    // If it's the first time sorting, save the original order
    if (originalOrder.length === 0) {
        originalOrder = products.slice();  // Save the original product order
    }

    if (sortOption === "latest") {
        // Reset to the original order if 'latest' is selected
        productGrid.innerHTML = "";
        originalOrder.forEach(product => productGrid.appendChild(product));
        return;
    }

    // Sort products based on the selected option
    products.sort((a, b) => {
        const priceA = parseInt(a.getAttribute("data-price"), 10);
        const priceB = parseInt(b.getAttribute("data-price"), 10);

        if (sortOption === "low-to-high") {
            return priceA - priceB;
        } else if (sortOption === "high-to-low") {
            return priceB - priceA;
        }
        return 0;
    });

    
    productGrid.innerHTML = "";
    products.forEach(product => productGrid.appendChild(product));
}
        // JavaScript
        window.onload = function () {
            const fullName = sessionStorage.getItem("fullName"); // Check if the user is logged in
            const loginRegisterLink = document.getElementById("loginRegisterLink1");
            const loginRegisterLinkcp  = document.getElementById("loginRegisterLink");
            const saleProducts = document.querySelectorAll(".Saleproduct");
        
            // Update login/register link if the user is logged in
            if (fullName) {
                loginRegisterLink.textContent = `Hello, ${fullName}`;
                loginRegisterLinkcp.textContent = `Hello, ${fullName}`;

                logoutLink.style.display = "block"; // Show the logout link when the user is logged in

             //   loginRegisterLink.href = "#";
             const handleLogout = function (link) {
                sessionStorage.removeItem("fullName");
                sessionStorage.removeItem("boughtitems");
                sessionStorage.removeItem("cart");
                link.textContent = "LOGIN / REGISTER";
                link.href = "Login.html";
            };

            loginRegisterLink.addEventListener("click", function () {
                handleLogout(loginRegisterLink);
            });

            loginRegisterLinkcp.addEventListener("click", function () {
                handleLogout(loginRegisterLinkcp);
            });

            }
        
            // Add click event listener to all Saleproduct elements
            saleProducts.forEach((product) => {
                product.addEventListener("click", function () {
                    if (fullName) {
                        // User is logged in, navigate to the product details page
                        const productUrl = product.getAttribute("data-url"); // Get the product URL
                        sessionStorage.removeItem("boughtitems");
                        window.location.href = productUrl; // Redirect to the URL
                    } else {
                        // User is not logged in, show alert and redirect to login
                        alert("Please log in or register before viewing the product.");
                        window.location.href = "Login.html";
                    }
                });
            });
        };
        document.addEventListener("DOMContentLoaded", function () {
            // Select all quantity input fields and their associated buttons
            const quantityInputs = document.querySelectorAll(".quantity-input");
            const plusButtons = document.querySelectorAll(".Plus");
            const minusButtons = document.querySelectorAll(".minus");
        
            plusButtons.forEach((plusButton, index) => {
                plusButton.addEventListener("click", () => {
                    const quantityInput = quantityInputs[index];
                    let currentValue = parseInt(quantityInput.value);
                    quantityInput.value = currentValue + 1; // Increase value by 1
                });
            });
        
            minusButtons.forEach((minusButton, index) => {
                minusButton.addEventListener("click", () => {
                    const quantityInput = quantityInputs[index];
                    let currentValue = parseInt(quantityInput.value);
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1; // Decrease value by 1 (minimum is 1)
                    }
                });
            });
        });
        document.addEventListener('DOMContentLoaded', function () {
            // Retrieve the cart data from sessionStorage
            let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        
            // Function to update cart details
            function updateCartDetails() {
                // Calculate subtotal
                let subtotal = cart.reduce((sum, item) => sum + item.total, 0);
        
                // Calculate item count based on unique product_ids
                let itemCount = new Set(cart.map(item => item.product_id)).size; // Count unique product_ids
        
                // Update the subtotal
                document.querySelector('#PriceofProductDesktop').textContent = `₱${subtotal.toFixed(2)}`;
                document.querySelector('#PriceofProductmobile').textContent = `₱${subtotal.toFixed(2)}`;
        
                // Update the cart item count (unique products)
                document.querySelector('#cartItemCountDesktop').textContent = `${itemCount}`;
                document.querySelector('#cartItemCountmobile').textContent = `${itemCount}`;
            }
        
            // Call the updateCartDetails function on page load
            updateCartDetails();
        
            // Event listener for adding items to the cart
            document.querySelector('.add-to-cart').addEventListener('click', function () {
                // Get the product details
                const productImage = document.querySelector('.productView-image img').src;
                const productName = document.getElementById('productView-name').textContent.trim();
                const productPrice = parseFloat(
                    document.querySelector('.productViewPrice').textContent.replace(/[^0-9.-]+/g, "")
                );
                const productQuantity = parseInt(document.querySelector('.quantity-input').value);

                const availableStock = parseInt(
                    document.querySelector('.quantity-Available').getAttribute('value')
                );
        
                // Check if the desired quantity exceeds available stock
                if (productQuantity > availableStock) {
                    alert(`Only ${availableStock} pieces are available. Please reduce the quantity.`);
                    return; // Stop execution if the quantity is invalid
                }
                // Generate a new unique product_id for the product
                const productId = Date.now(); // Using current timestamp for product_id, you can change this logic if needed
        
                // Calculate total price for the selected quantity
                const totalPrice = productPrice * productQuantity;
        
                // Create a cart object with product_id
                const cartItem = {
                    product_id: productId, // Assigning a unique product_id
                    image: productImage,
                    name: productName,
                    price: productPrice,
                    quantity: productQuantity,
                    total: totalPrice,
                };
        
                // Add the new item to the cart
                cart.push(cartItem);
        
                // Save the updated cart to sessionStorage
                sessionStorage.setItem('cart', JSON.stringify(cart));
        
                // Update the cart details
                updateCartDetails();
        
                // Show an alert message
                alert('Product added to cart successfully!');
            });
        });
        





            document.addEventListener('DOMContentLoaded', function () {
                // Retrieve the cart data from sessionStorage
                let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
            
                // Reference to the cart table body and the total display
                const cartItemsTable = document.querySelector('.cart-items tbody');
                const subtotalElement = document.querySelector('.subtotal span:last-child');
                const totalElement = document.querySelector('.total span:last-child');
            
                // Function to format price with commas
                function formatPrice(price) {
                    return price.toLocaleString('en-US', { style: 'currency', currency: 'PHP' }).replace("PHP", "₱").trim();
                }
            
                // Function to update the cart display
                function renderCart() {
                    // Clear the current table rows
                    cartItemsTable.innerHTML = '';
                    let subtotal = 0;
            
                    // Loop through the cart items
                    cart.forEach((item, index) => {
                        const row = document.createElement('tr');
                        
                        // Add a class to highlight selected item
                        const selectedClass = item.selected ? 'selected' : '';
            
                        row.innerHTML = `
                            <td class="${selectedClass}">
                                <button type="button" class="select-item" data-index="${index}">
                                    ${item.selected ? '✔' : ''}
                                </button>
                            </td>
                            <td>
                                <div class="product-info">
                                    <img src="${item.image}" alt="Product Image">
                                    <span>${item.name}</span>
                                </div>
                            </td>
                            <td>${formatPrice(item.price)}</td>
                            <td>
                                <div class="quantity-control">
                                    <button class="minus" data-index="${index}">-</button>
                                    <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input">
                                    <button class="plus" data-index="${index}">+</button>
                                </div>
                            </td>
                            <td>${formatPrice(item.price * item.quantity)}</td>
                            <td>
                                <button class="remove" data-index="${index}">Remove</button>
                            </td>
                        `;
            
                        cartItemsTable.appendChild(row);
            
                        // Update the subtotal for selected items only
                        if (item.selected) {
                            subtotal += item.price * item.quantity;
                        }
                    });
            
                    // Update the subtotal and total sections
                    subtotalElement.textContent = `${formatPrice(subtotal)}`;
                    totalElement.textContent = `${formatPrice(subtotal)}`;

                  
                   
                
                }
            
                // Event delegation for select/deselect button
                cartItemsTable.addEventListener('click', function (e) {
                    if (e.target.classList.contains('select-item')) {
                        const index = e.target.dataset.index;
                        const selectedItem = cart[index];
            
                        // Toggle selection for this item
                        selectedItem.selected = !selectedItem.selected;
            
                        // Update the button text (Select/Deselect)
                        e.target.textContent = selectedItem.selected ? 'Deselect' : 'Select';
            
                        // Add or remove the 'selected' class for visual feedback
                        const row = e.target.closest('tr');
                        if (selectedItem.selected) {
                            row.classList.add('selected');
                        } else {
                            row.classList.remove('selected');
                        }
            
                        // Save the updated cart to sessionStorage
                        sessionStorage.setItem('cart', JSON.stringify(cart));
            
                        // Re-render the cart to reflect the updated selection and recalculate totals
                        renderCart();
                    }
                });
            
                // Event delegation for quantity update and remove
                cartItemsTable.addEventListener('click', function (e) {
                    const index = e.target.dataset.index;
            
                    // Handle quantity decrease
                    if (e.target.classList.contains('minus')) {
                        if (cart[index].quantity > 1) {
                            cart[index].quantity--;
                        }
                    }
            
                    // Handle quantity increase
                    if (e.target.classList.contains('plus')) {
                        cart[index].quantity++;
                    }
            
                    // Handle product removal
                    if (e.target.classList.contains('remove')) {
                        cart.splice(index, 1); // Remove the item from the cart
                    }
            
                    // Save the updated cart and re-render
                    sessionStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                });
            
                // Update quantity from input field
                cartItemsTable.addEventListener('input', function (e) {
                    if (e.target.classList.contains('quantity-input')) {
                        const index = e.target.dataset.index;
                        const newQuantity = parseInt(e.target.value);
            
                        if (newQuantity > 0) {
                            cart[index].quantity = newQuantity;
                        }
            
                        // Save the updated cart and re-render
                        sessionStorage.setItem('cart', JSON.stringify(cart));
                        renderCart();
                    }
                });
            
                // Initial render of the cart
                renderCart();
            });

















        
        document.addEventListener('DOMContentLoaded', function () {
            // Reference to the "Proceed to Checkout" button
            const checkoutButton = document.querySelector('.proceed-to-checkout');
            
            // Function to check if any items are selected and calculate the total
            function getSelectedItems() {
                // Retrieve the cart data from sessionStorage
                const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
                
                // Filter selected items and calculate the total
                const selectedItems = cart.filter(item => item.selected);
                const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                return { selectedItems, total };
            }
        
            // Event listener for the "Proceed to Checkout" button
            checkoutButton.addEventListener('click', function () {
                // Get selected items and their total
                const { selectedItems, total } = getSelectedItems();
        
                // Check if there are selected items
                if (selectedItems.length === 0) {
                    // Show error message (you can customize this to show a modal, alert, etc.)
                    alert('You must select at least one item to proceed to checkout.');
                    return; // Prevent checkout if no items are selected
                }
        
                // Get the selected payment/shipping method (since both are the same in your case)
                const shippingMethod = document.querySelector('input[name="shipping"]:checked');
                
                // Check if a shipping/payment method is selected
                if (!shippingMethod) {
                    alert('Please select a shipping/payment method.');
                    return;
                }
        
                // Save selected items, total, and selected shipping method to sessionStorage
                sessionStorage.setItem('selectedItems', JSON.stringify(selectedItems));
                sessionStorage.setItem('total', total);
                sessionStorage.setItem('shippingMethod', shippingMethod.value); // Save the selected method
        
                // Redirect to checkout page
                window.location.href = 'checkout.html';
            });
        });
        
        
        

        document.addEventListener('DOMContentLoaded', function () {
            const proceedBtn = document.querySelector('.proceed-btn');
            proceedBtn.addEventListener('click', function (e) {
                e.preventDefault(); // Prevent default form submission
        
                // Collect delivery and payment details
                const fullname = document.getElementById('fullname').value;
                const contactnumber = document.getElementById('contactnumber').value;
                const zipcode = document.getElementById('zipcode').value;
                const street = document.getElementById('street').value;
                const barangay = document.getElementById('barangay').value;
                const municipality = document.getElementById('municipality').value;
                const province = document.getElementById('province').value;
                const deliveryFee = document.getElementById('delivery-fee').value;
         // Predefined delivery fees mapping (valid ZIP codes)
                
                // Get the selected shipping method (payment method)
                const shippingMethod = sessionStorage.getItem('shippingMethod');
        
                // Check if payment method is Gcash or Paymaya
                let paymentStatus = 'Not Paid';
                const paidCheckbox = document.getElementById('gcash-paid');
                if ((shippingMethod === 'Gcash' || shippingMethod === 'Paymaya') && paidCheckbox.checked) {
                    paymentStatus = 'Paid';
                } else if (shippingMethod === 'Gcash' || shippingMethod === 'Paymaya') {
                    alert('Please check the "Paid" option for Gcash or Paymaya payments.');
                    return;
                }
        
                // Validate if all required fields are filled
                if (!fullname || !contactnumber || !zipcode || !street || !barangay || !municipality || !province) {
                    alert('Please fill in all delivery details.');
                    return;
                }
                if (!/^\d{11}$/.test(contactnumber)) {
                    alert('Invalid contact number. Please enter a valid 11-digit number');
                    return;
                }
             

                const deliveryFees = {
                    "6000": 250, "6001": 210, "6002": 205, "6003": 200, "6004": 195, "6005": 190,
                    "6006": 185, "6007": 180, "6008": 175, "6009": 170, "6010": 100, "6011": 120,
                    "6012": 50, "6013": 120, "6014": 245, "6015": 245, "6016": 255, "6017": 255,
                    "6018": 260, "6019": 270, "6020": 275, "6021": 280, "6022": 285, "6023": 290,
                    "6024": 294, "6025": 300, "6026": 305, "6027": 310, "6028": 315, "6029": 320,
                    "6030": 325
                };

                // Check for valid ZIP code
                if (!deliveryFees.hasOwnProperty(zipcode)) {
                    alert('Invalid ZIP code. Please enter a valid ZIP code.');
                    return;
                }
                // Retrieve cart items from session storage (check both selectedItems and boughtItems)
                const cartItems = JSON.parse(sessionStorage.getItem('selectedItems')) || JSON.parse(sessionStorage.getItem('boughtitems')) || [];
                
                let productDetails = '';
                cartItems.forEach(item => {
                    // Create plain text version of product details
                    const productInfo = `
                        Product Name: ${item.name}
                        Price: ₱${item.price.toLocaleString()}
                        Quantity: ${item.quantity}
                        
                    `;
                    productDetails += productInfo;
                });
        
                // Prepare the message content with shipping method and payment status included
                const messageContent = `
                    Order Details:
                    Full Name: ${fullname}
                    Contact Number: ${contactnumber}
                    Address: ${zipcode} ${street} ${barangay} ${municipality} ${province}
                    Delivery Fee: ${deliveryFee}
                    
                    Payment Method: ${shippingMethod ? shippingMethod : 'Not selected'}
                    Payment Status: ${paymentStatus}
                    
                    Items Ordered:
                    ${productDetails}
                    Total Price: ₱${document.getElementById('total-price').textContent.replace('₱', '')}
                `;
        
                // Web3Forms API call
                const formData = new FormData();
                formData.append("access_key", "54c674b3-f77b-42e1-8dcf-152f4bb1c0bf");
                formData.append("name", fullname);
                formData.append("subject", "New Order Placed");
                formData.append("message", messageContent);
        
                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {

                        if (sessionStorage.getItem('selectedItems')) {
                            sessionStorage.removeItem("selectedItems");
                                sessionStorage.removeItem("cart");
                        }else if(sessionStorage.getItem('boughtitems')) {
                            sessionStorage.removeItem("boughtitems");
                        }
                        // Redirect to order complete page
                        window.location.href = "ordercomplete.html"; 
                    } else {
                        console.error('API Error:', data);  // Log the error response
                        alert('There was an error processing your order. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Network Error:', error);  // Log the network error
                    alert('There was an error sending your order. Please try again.');
                });
            });
        });
        

//BUY NOW BUTTON 
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the boughtitems array
    let boughtitems = JSON.parse(sessionStorage.getItem('boughtitems')) || [];

    // Event listener for adding items to the cart
    const buyNowButton = document.querySelector('.buy-now');
    if (buyNowButton) {
        buyNowButton.addEventListener('click', function () {
           
            // Get the product details
            const productImage = document.querySelector('.productView-image img').src;
            const productName = document.getElementById('productView-name').textContent.trim();
            const productPrice = parseFloat(
                document.querySelector('.productViewPrice').textContent.replace(/[^0-9.-]+/g, "")
            );
            const productQuantity = parseInt(document.querySelector('.quantity-input').value);

              const availableStock = parseInt(
                    document.querySelector('.quantity-Available').getAttribute('value')
                );
        
                // Check if the desired quantity exceeds available stock
                if (productQuantity > availableStock) {
                    alert(`Only ${availableStock} pieces are available. Please reduce the quantity.`);
                    return; // Stop execution if the quantity is invalid
                }
            // Generate a new unique product_id for the product
            const productId = Date.now(); // Using current timestamp for product_id, you can change this logic if needed

            // Calculate total price for the selected quantity
            const totalPrice = productPrice * productQuantity;

            // Create a cart object with product_id
            const itemsDetails = {
                product_id: productId, // Assigning a unique product_id
                image: productImage,
                name: productName,
                price: productPrice,
                quantity: productQuantity,
                total: totalPrice,
            };

            // Add the new item to the cart
            boughtitems.push(itemsDetails);

            // Save the updated cart to sessionStorage
            sessionStorage.setItem('boughtitems', JSON.stringify(boughtitems));

            // Debugging log
            console.log('Redirecting to buynowProducts.html...');

            // Redirect to buynowProducts.html
            window.location.href = "../buynowProducts.html";
        });
    } else {
        console.error('.buy-now button not found.');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // Fetch cart items from sessionStorage
    let boughtitems = JSON.parse(sessionStorage.getItem('boughtitems')) || [];

    // Utility function to format prices with commas and two decimal places
    function formatPrice(value) {
        return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Function to render cart items
    function renderCartItems() {
        const tbody = document.querySelector('.bought-items tbody');
        const subtotalElement = document.querySelector('.boughtsubtotal span:last-child');
        const totalElement = document.querySelector('.boughttotal span:last-child');

        tbody.innerHTML = ""; // Clear previous rows
        let cartTotal = 0;

        // Render each item in the cart
        boughtitems.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="product-info">
                        <img src="${item.image}" alt="${item.name}" width="50">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td>₱${formatPrice(item.price)}</td>
                <td>
                    <div class="quantity-control">
                        <button class="decrease-qty" data-index="${index}">−</button>
                        <input type="number" value="${item.quantity}" readonly>
                        <button class="increase-qty" data-index="${index}">+</button>
                    </div>
                </td>
                <td>₱${formatPrice(item.total)}</td>
                <td><button class="remove" data-index="${index}">Remove</button></td>
            `;
            tbody.appendChild(row);
            cartTotal += item.total;
        });

        // Update subtotal and total
        subtotalElement.textContent = `₱${formatPrice(cartTotal)}`;
        totalElement.textContent = `₱${formatPrice(cartTotal)}`;

        // Handle empty cart
        if (boughtitems.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="5" style="text-align: center;">No Purchasing Items</td>`;
            tbody.appendChild(emptyRow);
            subtotalElement.textContent = "₱0.00";
            totalElement.textContent = "₱0.00";
        }
       
    }

    // Event listeners for quantity and remove buttons
    document.querySelector('.bought-items').addEventListener('click', function (e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (e.target.classList.contains('increase-qty')) {
            // Increase quantity
            boughtitems[index].quantity += 1;
            boughtitems[index].total = boughtitems[index].price * boughtitems[index].quantity;
        } else if (e.target.classList.contains('decrease-qty')) {
            // Decrease quantity
            if (boughtitems[index].quantity > 1) {
                boughtitems[index].quantity -= 1;
                boughtitems[index].total = boughtitems[index].price * boughtitems[index].quantity;
            }
        } else if (e.target.classList.contains('remove')) {
            // Remove item
            boughtitems.splice(index, 1);
        }

        // Update sessionStorage and re-render cart
        sessionStorage.setItem('boughtitems', JSON.stringify(boughtitems));
       
        renderCartItems();
        
    });

    
    renderCartItems();
  
});







document.addEventListener('DOMContentLoaded', function () {
    // Attach click event listener to the button
    document.querySelector('.proceedtocheckout').addEventListener('click', function () {
        console.log("Proceed to Checkout button clicked");

        // Check if there are items in the cart
        const cartItems = JSON.parse(sessionStorage.getItem('boughtitems')) || [];
        console.log("bought Items:", cartItems);
        if (cartItems.length === 0) {
            alert("No items to checkout.");
            return;
        }

        // Check if a payment method is selected
        const selectedPaymentMethod = document.querySelector('input[name="shipping"]:checked');
        console.log("Selected Payment Method:", selectedPaymentMethod);
        if (!selectedPaymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        // Save selected payment method to session storage
        sessionStorage.setItem('shippingMethod', selectedPaymentMethod.value);

        // Store bought items in session storage
        console.log("Storing bought items in sessionStorage...");
        sessionStorage.setItem('boughtitems', JSON.stringify(cartItems));

        // Navigate to the checkout page
        console.log("Navigating to checkout page...");
        window.location.href = "checkoutboughtitems.html";
    });
});
