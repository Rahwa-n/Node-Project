var stripe = Stripe('pk_test_51JAIhqCaj62Dl6JMou1aFilbJZQlfWI19b86QUft4fNCOMfvAyEKavLxWZWiw7RRA6mRmn1NITYeeHHQgnv3TfDa00r0cuQuos');

var $form = $('#checkout-form');

$form.submit(function(event){
  $('#charge-error').removeClass('hidden');
  $form.find('button').prop('disabled', true);
  Stripe.card.creatreToken({
    number: $('#carad-number').val(),
    cvc: $('#carad-cvc').val(),
    exp_month: $('#card-expiry-month').val(),
    exp_year: $('#card-expiry-year').val(),
    name: $('#card-name').val()
  }, stripeResponseHandler);
  return false;
});

function stripeResponseHandler(status, response) {
  if (response.error) { //problem/error to validate credit card
    //show error
    $('#charge-error').text(response.error.message);//re-enable submission
    $('#charge-error').removeClass('hidden');
    $('button').prop('disabeled', false);
  } else { //token was created
    //get the token ID
    var token = response.id;
    //insert the token into the form so it gets submitted to the server
    $form.append($('<input type="hidden name="stripeToken" />').val(token));
    //submit the form
    $form.get(0).submit();
  }
}
