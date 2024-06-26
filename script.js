const toggleButton = document.getElementById('toggle-button');
const itemsContainer = document.getElementById('items-container');

toggleButton.addEventListener('click', () => {
  itemsContainer.style.display = itemsContainer.style.display === 'none'? 'block' : 'none';
});


$(document).ready(function() {
    $('#toggle-button').on('click', function() {
      var icon = $('#toggle-icon');
      icon.hasClass('ri-arrow-right-s-fill') ? icon.removeClass('ri-arrow-right-s-fill').addClass('ri-arrow-down-s-fill') : icon.removeClass('ri-arrow-down-s-fill').addClass('ri-arrow-right-s-fill');
    });
  });

  
  $(document).ready(function() {
    var input = $('#myInput');
    var confirmBtn = $('#confirm-btn');
    var confirmIcon = $('#confirm-icon');

    confirmBtn.on('click', function() {
      if (input.prop('readonly')) {
        input.prop('readonly', false);
        confirmIcon.removeClass('fa-check').addClass('fa-pencil-alt');
      } else {
        input.prop('readonly', true);
        confirmIcon.removeClass('fa-pencil-alt').addClass('fa-check');
      }
    });
  });