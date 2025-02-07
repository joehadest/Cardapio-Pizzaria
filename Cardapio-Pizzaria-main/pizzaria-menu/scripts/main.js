document.addEventListener('DOMContentLoaded', function () {
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const cashInfo = document.querySelector('.cash-info');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function () {
            if (this.value === 'cash') {
                cashInfo.classList.add('show');
            } else {
                cashInfo.classList.remove('show');
            }
        });
    });

    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const target = this.getAttribute('onclick').split("'")[1];
            tabContents.forEach(content => {
                if (content.id === target) {
                    content.classList.add('show');
                } else {
                    content.classList.remove('show');
                }
            });
        });
    });
});

function showTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('show');
        } else {
            content.classList.remove('show');
        }
    });
}