$(document).on('click', '#plus', (event) => {
    let priceValue = parseFloat($('#priceValue').val())
    let quantity   = parseInt($('#quantity').val()) 

    priceValue += parseFloat($('#priceHidden').val())
    quantity++

    $('#quantity').val(quantity)
    $('#priceValue').val(priceValue.toFixed(2))
    $('#total').html(quantity)
})

$(document).on('click', '#minus', (event) => {
    let priceValue = parseFloat($('#priceValue').val())
    let quantity   = parseInt($('#quantity').val())
    
    if (quantity === 1) {
        priceValue = parseFloat($('#priceHidden').val())
    } else {
        priceValue -= parseFloat($('#priceHidden').val())
        quantity--
    }

    $('#quantity').val(quantity)
    $('#priceValue').val(priceValue.toFixed(2))
    $('#total').html(quantity)
})