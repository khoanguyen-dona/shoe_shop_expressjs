
function formatCurrency  (price)  {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
}

module.exports = formatCurrency ;
