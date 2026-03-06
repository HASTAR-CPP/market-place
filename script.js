document.addEventListener('DOMContentLoaded', () => {

    // 1. Add btn interaction (Index Page)
    const addButtons = document.querySelectorAll('.btn-primary');
    addButtons.forEach(button => {
        if (button.classList.contains('btn-spacer')) return;

        button.addEventListener('click', function () {
            const originalText = this.innerText;
            this.innerText = 'Added!';
            this.style.background = '#000000';
            this.style.color = '#FFFFFF';

            setTimeout(() => {
                this.innerText = originalText;
                this.style.background = '';
                this.style.color = '';
            }, 1000);
        });
    });

    // 2. Proceed to Checkout Navigation (Index Page)
    const proceedBtn = document.querySelector('.btn-proceed:not(#pay-btn):not(#confirm-pay)');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    // 3. Checkout Page Interactions (Checkout Page)
    const payBtn = document.getElementById('pay-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closeModal = document.querySelector('.close-modal');
    const confirmPay = document.getElementById('confirm-pay');

    if (payBtn && paymentModal) {
        // Open Modal
        payBtn.addEventListener('click', () => {
            paymentModal.classList.add('active');
        });

        // Close Modal
        closeModal.addEventListener('click', () => {
            paymentModal.classList.remove('active');
        });

        // Close when clicking outside content
        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                paymentModal.classList.remove('active');
            }
        });
    }

    // 4. Confirm Payment Navigation (Modal)
    if (confirmPay) {
        confirmPay.addEventListener('click', () => {
            window.location.href = 'success.html';
        });
    }
});
