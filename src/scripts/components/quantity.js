import $ from 'jquery';

theme.Quantity = (function() {

  $(document).on('click', '.js--quantity', function(el) {
    el.preventDefault();
    const $input = $(this).parent().find('input');
    // eslint-disable-next-line radix
    const inputVal = parseInt($input.val());
    const incrementBoo = $(this).attr('data-increment');
    const increment = incrementBoo.toString();

    if (increment === 'true') {
      const newVal = inputVal + 1;
      $input.val(newVal);
    } else {
      const newVal = inputVal - 1;
      $input.val(newVal);
    }
  });

})();


// if (inputVal - 1 !== 0)