$(() => {
    Stripe.setPublishableKey('pk_test_OIrqsNbXYvgMj34kY1UpiA3000XhBEWM2N')

    const stripeResponseHandler = (status, response) => {
        const $form = $('#payment-form')

        if (response.error) {
            console.log(`Stripe error: ${ response.error.message }`);
            
            debugger

            $form.find('.payment-errors').text(response.error.message)
            
            // $form.find('.payment-errors').parent().parent().css('display', 'block')
            $form.find('.payment-errors').parent().parent().show()
            
            $('#cardSubmit').prop('disabled', false)
        } else {
            const token = response.id

            $form.append($('<input type="hidden" name="stripeToken" />').val(token))

            $form.get(0).submit()
        }
    }

    $('#payment-form').submit((event) => {
        event.preventDefault()

        const cardNumber = $('#card-number').val()
        const cvcCode    = $('#card-cvc').val()
        const expMonth   = $('#card-expiry-month-year').val().slice(0, 2)
        const expYear    = $('#card-expiry-month-year').val().slice(2, 4)

        $('#cardSubmit').prop('disabled', true)

        Stripe.card.createToken({
            cvc:       cvcCode,
            number:    cardNumber,
            exp_month: expMonth,
            exp_year:  expYear
        }, stripeResponseHandler)

        console.log('got submit event')
    })
})