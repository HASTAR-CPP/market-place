document.addEventListener('DOMContentLoaded', () => {

    // 0. Global Cart State & Settings
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    const PRICES = {
        'Maggi': 40,
        'Sunny side up': 20,
        'Bread omelette': 60
    };

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // 1. Index Page: Dynamic Cart Rendering & Interactions
    function renderIndexCart() {
        document.querySelectorAll('.product-card').forEach(card => {
            const h3 = card.querySelector('.card-info h3');
            if (!h3) return; // Skip if it's not a product card

            const dishName = h3.childNodes[0].nodeValue.trim();
            const actions = card.querySelector('.card-actions');
            if (!actions) return;

            if (cart[dishName] > 0) {
                // Determine if we need to replace the Add button
                let qtyControl = actions.querySelector('.qty-control');
                if (!qtyControl) {
                    const btn = actions.querySelector('.btn-primary');
                    if (btn) btn.remove(); // Remove Add to Cart button

                    qtyControl = document.createElement('div');
                    qtyControl.className = 'qty-control';
                    qtyControl.innerHTML = `
                        <button class="qty-btn dec">-</button>
                        <span class="qty-val">${cart[dishName]}</span>
                        <button class="qty-btn inc">+</button>
                    `;
                    actions.appendChild(qtyControl);

                    // Attach event listeners for +/-
                    qtyControl.querySelector('.dec').addEventListener('click', () => {
                        cart[dishName]--;
                        if (cart[dishName] <= 0) {
                            delete cart[dishName];
                            qtyControl.remove();
                            // Restore Add to Cart button
                            const addBtn = document.createElement('button');
                            addBtn.className = 'btn btn-primary';
                            addBtn.innerText = 'Add to cart';
                            actions.appendChild(addBtn);
                        } else {
                            qtyControl.querySelector('.qty-val').innerText = cart[dishName];
                        }
                        saveCart();
                    });

                    qtyControl.querySelector('.inc').addEventListener('click', () => {
                        cart[dishName]++;
                        qtyControl.querySelector('.qty-val').innerText = cart[dishName];
                        saveCart();
                    });
                } else {
                    // Just update quantity text if control already exists
                    qtyControl.querySelector('.qty-val').innerText = cart[dishName];
                }
            }
        });

        const bottomActions = document.querySelector('.bottom-actions');
        if (bottomActions) {
            bottomActions.style.display = Object.keys(cart).length > 0 ? 'flex' : 'none';
        }
    }

    // Global listener for "Add to cart" buttons
    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-primary') && e.target.textContent.trim().toLowerCase() === 'add to cart') {
            const card = e.target.closest('.product-card');
            if (card) {
                const h3 = card.querySelector('.card-info h3');
                if (h3) {
                    const dishName = h3.childNodes[0].nodeValue.trim();
                    cart[dishName] = 1;
                    saveCart();
                    renderIndexCart();
                }
            }
        }
    });

    // Run this whenever index page loads to restore cart state
    renderIndexCart();

    // 2. Proceed to Checkout Navigation
    const proceedBtn = document.querySelector('.btn-proceed:not(#pay-btn):not(#confirm-pay)');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    // 3. Checkout Page Interactions & Rendering
    const cartLinesContainer = document.getElementById('cart-lines-container');
    if (cartLinesContainer) {
        let productTotal = 0;
        let index = 1;

        // Show empty message if cart is empty
        if (Object.keys(cart).length === 0) {
            cartLinesContainer.innerHTML = '<div class="cart-row" style="color:var(--text-muted); font-size:1.25rem;">Your cart is empty.</div>';
        } else {
            // Render items
            for (const [item, qty] of Object.entries(cart)) {
                let price = PRICES[item] || 40; // Default price if not found

                const row = document.createElement('div');
                row.className = 'cart-row';
                row.innerHTML = `
                    <span class="item-name">${index}. ${item}</span>
                    <span class="item-qty">x${qty} = <span style="font-weight: 500;">₹${price * qty}</span></span>
                `;
                cartLinesContainer.appendChild(row);

                productTotal += (price * qty);
                index++;
            }
        }

        // Update Breakdown
        const hasItems = Object.keys(cart).length > 0;
        const deliveryCost = hasItems ? 20 : 0;

        const deliverySpan = document.getElementById('delivery-charge');
        if (deliverySpan) deliverySpan.innerText = `- ₹${deliveryCost}`;

        const ptSpan = document.getElementById('product-total');
        if (ptSpan) ptSpan.innerText = `- ₹${productTotal}`;

        const finalSpan = document.getElementById('final-total');
        if (finalSpan) {
            const finalTotal = productTotal + deliveryCost;
            finalSpan.innerText = `₹${finalTotal}`;
        }
    }

    // Modal logic for checkout
    const payBtn = document.getElementById('pay-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closeModal = document.querySelector('.close-modal');
    const confirmPay = document.getElementById('confirm-pay');

    if (payBtn && paymentModal) {
        payBtn.addEventListener('click', () => {
            const name = document.getElementById('cust-name');
            const phone = document.getElementById('cust-phone');
            const address = document.getElementById('cust-address');
            const trackId = document.getElementById('cust-id');
            const trackPass = document.getElementById('cust-pass');

            if (name && (!name.value.trim() || !phone.value.trim() || !address.value.trim() || !trackId.value.trim() || !trackPass.value.trim())) {
                alert("Please fill in your Delivery Details & Tracking Info before paying.");
                return;
            }
            paymentModal.classList.add('active');
        });

        closeModal.addEventListener('click', () => {
            paymentModal.classList.remove('active');
        });

        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) paymentModal.classList.remove('active');
        });
    }

    if (confirmPay) {
        confirmPay.addEventListener('click', () => {
            const finalP = document.getElementById('final-total') ? document.getElementById('final-total').innerText : '₹0';

            // Generate a simple unique ID for this order
            const orderId = Date.now().toString();

            const n = document.getElementById('cust-name') ? document.getElementById('cust-name').value.trim() : '';
            const p = document.getElementById('cust-phone') ? document.getElementById('cust-phone').value.trim() : '';
            const a = document.getElementById('cust-address') ? document.getElementById('cust-address').value.trim() : '';
            const uid = document.getElementById('cust-id') ? document.getElementById('cust-id').value.trim() : '';
            const upass = document.getElementById('cust-pass') ? document.getElementById('cust-pass').value.trim() : '';

            const newOrder = {
                id: orderId,
                customer: { name: n, phone: p, address: a, userId: uid, userPass: upass },
                items: cart,
                total: finalP,
                time: new Date().toLocaleTimeString(),
                status: 'pending',
                rating: null
            };

            // FCFS Order List
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(newOrder);
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.setItem('myOrderId', orderId); // Track local customer's id

            // Clear cart on checkout
            localStorage.removeItem('cart');
            window.location.href = 'success.html';
        });
    }

    // 4. Customize Modal interactions
    const customizeBtns = document.querySelectorAll('.btn-outline');
    const customizeModal = document.getElementById('customize-modal');
    const closeCustomize = document.getElementById('close-customize-modal');
    const customizeTitle = document.getElementById('customize-title');
    const customizeOptions = document.getElementById('customize-options');
    const saveCustomizationBtn = document.getElementById('save-customization');

    const dishCustomizations = {
        'Maggi': [
            { type: 'radio', group: 'maggi-type', name: 'plain maggi - ₹50', id: 'maggi-plain', checked: true },
            { type: 'radio', group: 'maggi-type', name: 'masala maggi - ₹60', id: 'maggi-masala' },
            { type: 'radio', group: 'maggi-type', name: 'veggies loaded maggi - ₹70', id: 'maggi-veggies' },
            { type: 'radio', group: 'maggi-type', name: 'egg maggi - ₹60', id: 'maggi-egg' },
            { type: 'radio', group: 'maggi-type', name: 'double egg maggi - ₹80', id: 'maggi-double' }
        ],
        'Sunny side up': [
            { type: 'radio', group: 'sunny-type', name: 'Single egg - ₹20', id: 'sunny-single', checked: true },
            { type: 'radio', group: 'sunny-type', name: 'double egg - ₹30', id: 'sunny-double' }
        ],
        'Bread omelette': [
            { type: 'radio', group: 'bread-egg', name: 'single egg', id: 'bread-single', checked: true },
            { type: 'radio', group: 'bread-egg', name: 'double egg', id: 'bread-double' },
            { type: 'checkbox', name: 'veggies ++', id: 'bread-veggies' }
        ]
    };

    customizeBtns.forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === 'customize') {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                let dishName = 'Maggi';
                if (card) {
                    const h3 = card.querySelector('.card-info h3');
                    if (h3) dishName = h3.childNodes[0].nodeValue.trim();
                }

                customizeTitle.innerText = `Customize ${dishName}`;
                customizeOptions.innerHTML = '';

                const options = dishCustomizations[dishName] || dishCustomizations['Maggi'];

                options.forEach(opt => {
                    const group = document.createElement('label');
                    group.className = 'customize-option-group';

                    const input = document.createElement('input');
                    input.type = opt.type;
                    if (opt.type === 'radio') input.name = opt.group;
                    input.id = opt.id;
                    if (opt.checked) input.checked = true;

                    const text = document.createTextNode(' ' + opt.name);

                    group.appendChild(input);
                    group.appendChild(text);
                    customizeOptions.appendChild(group);
                });

                customizeModal.classList.add('active');
            });
        }
    });

    if (closeCustomize) {
        closeCustomize.addEventListener('click', () => {
            customizeModal.classList.remove('active');
        });
    }

    if (customizeModal) {
        customizeModal.addEventListener('click', (e) => {
            if (e.target === customizeModal) {
                customizeModal.classList.remove('active');
            }
        });
    }

    if (saveCustomizationBtn) {
        saveCustomizationBtn.addEventListener('click', function () {
            const originalText = this.innerText;
            this.innerText = 'Saved!';
            this.style.background = '#000000';
            this.style.color = '#FFFFFF';

            setTimeout(() => {
                this.innerText = originalText;
                this.style.background = '';
                this.style.color = '';
                if (customizeModal) customizeModal.classList.remove('active');
            }, 800);
        });
    }

    // 5. Success Page (Order Placed) Interaction
    const waitText = document.querySelector('.wait-text');
    const myOrderId = localStorage.getItem('myOrderId');

    if (waitText && myOrderId) {
        // Poll for order status to be changed by the vendor page
        const checkStatus = setInterval(() => {
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            let myOrder = orders.find(o => o.id === myOrderId);

            if (myOrder && (myOrder.status === 'confirmed' || myOrder.status === 'delivered')) {
                waitText.innerHTML = myOrder.status === 'delivered' ? 'ORDER <span class="highlight">DELIVERED</span>' : 'ORDER <span class="highlight">CONFIRMED</span>';
                if (myOrder.status === 'confirmed') clearInterval(checkStatus);

                // Show 5-star rating UI if not already present
                if (!document.getElementById('rating-container')) {
                    const ratingHtml = `
                        <div id="rating-container" style="margin-top: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                            <p style="font-size: 1.5rem;">Rate your experience!</p>
                            <div class="stars" style="display: flex; gap: 0.5rem; font-size: 2.5rem; cursor: pointer;">
                                <i class="ph ph-star" data-val="1"></i>
                                <i class="ph ph-star" data-val="2"></i>
                                <i class="ph ph-star" data-val="3"></i>
                                <i class="ph ph-star" data-val="4"></i>
                                <i class="ph ph-star" data-val="5"></i>
                            </div>
                            <button id="submit-feedback" class="btn btn-outline" style="margin-top: 1rem; display: none;">Submit Feedback</button>
                        </div>
                    `;
                    waitText.insertAdjacentHTML('afterend', ratingHtml);

                    let selectedRating = 0;
                    const stars = document.querySelectorAll('.stars i');
                    const submitBtn = document.getElementById('submit-feedback');

                    stars.forEach(star => {
                        star.addEventListener('click', (e) => {
                            selectedRating = parseInt(e.target.getAttribute('data-val'));
                            stars.forEach(s => {
                                if (parseInt(s.getAttribute('data-val')) <= selectedRating) {
                                    s.classList.remove('ph');
                                    s.classList.add('ph-fill');
                                    s.style.color = '#FFD700';
                                } else {
                                    s.classList.remove('ph-fill');
                                    s.classList.add('ph');
                                    s.style.color = '';
                                }
                            });
                            // Show the submit button once they pick a star rating
                            submitBtn.style.display = 'inline-block';
                        });
                    });

                    submitBtn.addEventListener('click', () => {
                        if (selectedRating > 0) {
                            // Save rating to the centralized FCFS list
                            let currentOrders = JSON.parse(localStorage.getItem('orders')) || [];
                            let updatedOrderIndex = currentOrders.findIndex(o => o.id === myOrderId);
                            if (updatedOrderIndex !== -1) {
                                currentOrders[updatedOrderIndex].rating = selectedRating;
                                localStorage.setItem('orders', JSON.stringify(currentOrders));
                            }

                            const p = document.querySelector('#rating-container p');
                            if (p) p.innerText = 'Thank you for your feedback!';

                            // Keep display but lock changes
                            document.querySelector('.stars').style.pointerEvents = 'none';
                            submitBtn.remove();
                        }
                    });
                }
            }
        }, 1000);
    }
});
