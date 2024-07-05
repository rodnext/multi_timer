let idTemporizador = 0;
let temporizadores = [];
let timerValues = {};


$('#add-temporizador').on("click", function () {
  idTemporizador++;
  let html = `

        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 p-1">
          <div class="card p-1 card-size" >
            <div class="input-group">
              <input type="text" id="nome-${idTemporizador}" value="" placeholder="Nome da sua vila" class="font-weight-bold form-control form-control-sm nome-input">
              <div class="input-group-append">
                <button class="btn btn-secondary btn-sm lock" data-id="${idTemporizador}"><i class="ri-lock-unlock-line"></i></button>
              </div>
            </div>
            
            <div class="row align-items-center text-dark mx-auto align-items-center">
              <div class="agrupar">
                  <div class="form-group">
                    <p class="font-weight-bold m-1 small-text"> D</p>
                  <input type="number" id="dias-${idTemporizador}" value="0" min="0" placeholder="DD" class="form-control tempo-input larger-input" oninput="validateInput(this, 30)">
                </div>
              </div>

              <div class="agrupar">
                  <div  class="form-group">
                    <p class="font-weight-bold m-1 small-text"> H</p>
                  <input type="number" id="horas-${idTemporizador}" value="0" min="0" max="23" placeholder="HH" class="form-control tempo-input larger-input" oninput="validateInput(this, 24)">
                </div>
              </div>

              <div class="agrupar">
                  <div class="form-group">
                    <p class="font-weight-bold m-1 small-text"> M</p>
                  <input type="number" id="minutos-${idTemporizador}" value="0" min="0" max="59" placeholder="MM" class="form-control tempo-input larger-input" oninput="validateInput(this, 60)">
                </div>
              </div>
              <div class="agrupar">
                  <div  class="form-group">
                    <p class="font-weight-bold m-1 small-text"> S</p>
                  <input type="number" id="segundos-${idTemporizador}" value="0" min="0" max="59" placeholder="SS" class="form-control tempo-input larger-input" oninput="validateInput(this, 60)">
                </div>
              </div>

                <div class="agrupar-botao btn-group mt-1 justify-content-center" >

                  <div  class="form-group" id="iniciar-${idTemporizador}">
                    <p class="font-weight-bold mb-1 small-text">Iniciar</p>
                    <button class="font-weight-bold btn btn-warning btn-sm rounded-circle"><i class="ri-play-fill"></i></button>
                  </div>

                  <div class="form-group" id="parar-${idTemporizador}" style="display: none;">
                    <p class="font-weight-bold mb-1 small-text">Parar</p>
                    <button class="font-weight-bold btn btn-danger btn-sm rounded-circle"><i class="ri-stop-fill"></i></button>
                  </div>

                </div>
              </div>
            </div>
          </div>

  `;
  $('#temporizadores').append(html);
});


//Quando clicado trava o botão de nome da vila
$(document).on('click', '.lock', function() {
  let id = $(this).data('id');
  let nomeInput = $(`#nome-${id}`);
  this.classList.toggle('active');
  nomeInput.prop('readonly', !nomeInput.prop('readonly'));
  $(this).find('i').toggleClass('ri-lock-unlock-line ri-lock-line');
});

//Define um valor maximo para cada campo imput
function validateInput(input, maxValue) {
  if (input.value > maxValue) {
    input.value = maxValue;
  }
}

/*Quando clicado esconde o valor do imput
Quando sai do campo sem preencher ele retorna a zero*/
$(document).on('click', '.tempo-input', function() {
  $(this).val('s'); 
    $('.tempo-input').on('blur', function() {
      if ($(this).val() === '') {
        $(this).val(0);
      }
    });
});


/*Quando clicado no botão de iniciar inicia o temporizador
o botão iniciar é ocultado e aparece o botão parar*/
$(document).on('click', '[id^="iniciar-"]', function() {
  let id = $(this).attr('id').replace('iniciar-', '');
  $(`#dias-${id}, #horas-${id}, #minutos-${id}, #segundos-${id}`).prop('readonly', true);

  const dias = parseInt($(`#dias-${id}`).val());
  const horas = parseInt($(`#horas-${id}`).val());
  const minutos = parseInt($(`#minutos-${id}`).val());
  const segundos = parseInt($(`#segundos-${id}`).val());

  const totalTimeInSeconds = dias * 86400 + horas * 3600 + minutos * 60 + segundos;
  const startTime = Date.now();

  temporizadores[id] = setInterval(function() {
    const elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
    const remainingTimeInSeconds = totalTimeInSeconds - elapsedTimeInSeconds;

    if (remainingTimeInSeconds <= 0) {
      clearInterval(temporizadores[id]);
      $(`#dias-${id}, #horas-${id}, #minutos-${id}, #segundos-${id}`).prop('readonly', false).val(0);
      $(`#iniciar-${id}`).show();
      $(`#parar-${id}`).hide();
    } else {
      const remainingDias = Math.floor(remainingTimeInSeconds / 86400);
      const remainingHrs = Math.floor((remainingTimeInSeconds % 86400) / 3600);
      const remainingMins = Math.floor((remainingTimeInSeconds % 3600) / 60);
      const remainingSecs = remainingTimeInSeconds % 60;

      $(`#dias-${id}`).val(remainingDias);
      $(`#horas-${id}`).val(remainingHrs);
      $(`#minutos-${id}`).val(remainingMins);
      $(`#segundos-${id}`).val(remainingSecs);
    }
  }, 1000);

  $(this).hide();
  $(`#parar-${id}`).show();
});

/*Quando clicado em parar interrompe o temporizador, zera os campos inputs e
esconde o botão de parar e libera todos os campos*/
$(document).on('click', '[id^="parar-"]', function() {
  let id = $(this).attr('id').replace('parar-', '');
  clearInterval(temporizadores[id]);
  $(`#dias-${id}, #horas-${id}, #minutos-${id}, #segundos-${id}`).prop('readonly', false);
  $(`#dias-${id}`).val(0);
  $(`#horas-${id}`).val(0);
  $(`#minutos-${id}`).val(0);
  $(`#segundos-${id}`).val(0);
  $(`#iniciar-${id}`).show();
  $(`#parar-${id}`).hide();
});

//Ordena os cards por ordem de menor tempo no temporizador de cada um
$('#ordenar-tempo').on('click', function() {
  const temporizadores = [];
  $('#temporizadores .col-lg-4').each(function() {
    const id = $(this).find('input[type="text"]').attr('id').replace('nome-', '');
    const dias = parseInt($(`#dias-${id}`).val());
    const horas = parseInt($(`#horas-${id}`).val());
    const minutos = parseInt($(`#minutos-${id}`).val());
    const segundos = parseInt($(`#segundos-${id}`).val());
    const tempoTotal = dias * 86400 + horas * 3600 + minutos * 60 + segundos;
    temporizadores.push({ id, tempoTotal, element: $(this) });
  });

  temporizadores.sort((a, b) => a.tempoTotal - b.tempoTotal);

  $('#temporizadores').empty();
  temporizadores.forEach((temporizador) => {
    $('#temporizadores').append(temporizador.element);
  });
});

document.addEventListener("DOMContentLoaded", function() {
  var sidebar = document.getElementById("sidebar");
  var sidebarToggle = document.getElementById("sidebarToggle");
  var overlay = document.getElementById("overlay");

  function toggleSidebar() {
      sidebar.classList.toggle("collapsed");
  }

  function checkWindowSize() {
      if (window.innerWidth < 992) {
          sidebar.classList.add("collapsed");
      } else {
          sidebar.classList.remove("collapsed");
      }
  }

  sidebarToggle.addEventListener("click", toggleSidebar);
  window.addEventListener("resize", checkWindowSize);

  // Verifica o tamanho da janela ao carregar a página
  checkWindowSize();
});

