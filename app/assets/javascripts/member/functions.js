$(document).ready(function () {
    var larguraViewport = $(window).width();
    let active = false

    function atualizarLarguraViewport() {
        larguraViewport = $(window).width();

        if (larguraViewport > 831) {
            $(".aside").css("left", "0")
            active = false
            $(".line1").removeClass("active")
            $(".line2").removeClass("active")
            $(".line3").removeClass("active")

            $(".navbar-options").css("display", "block")
            $(".actions-user").css("display", "none")
        } else {
            $(".aside").css("left", "-100vw")
            $(".navbar-options").css("display", "none")
            $(".actions-user").css("display", "flex")
        }
    }

    atualizarLarguraViewport();

    $(window).resize(function () {
        atualizarLarguraViewport();
        $(".line1").removeClass("active")
        $(".line2").removeClass("active")
        $(".line3").removeClass("active")
        active = false
    });

    $(".button").on('click', function () {
        if (active == false) {
            $(".line1").addClass("active")
            $(".line2").addClass("active")
            $(".line3").addClass("active")

            $(".aside").css("left", "0")
        } else {
            $(".line1").removeClass("active")
            $(".line2").removeClass("active")
            $(".line3").removeClass("active")

            $(".aside").css("left", "-100vw")
        }
        active = !active
    });

    $(".button-add-numbers").on('click', function () {
        var value = parseInt($("#quantity-sorteio").val());
        var increment = parseInt($(this).attr('increment'));
        var decrement = parseInt($(this).attr('decrement'));

        if (increment)
            $("#quantity-sorteio").val(value + increment);

        if (decrement && value > 0)
            $("#quantity-sorteio").val(value - decrement);
    })

    $(".button-clear-numbers").on('click', function () {
        $("#quantity-sorteio").val(0);
    })

    var timerInterval;
    var elapsedTime = 10 * 60; // Inicia em 10 minutos
    var maxTime = 0; // Termina em 0 segundos

    function formatTime(timeInSeconds) {
        var minutes = Math.floor((timeInSeconds % 3600) / 60);
        var seconds = timeInSeconds % 60;
        return (
            (minutes < 10 ? "0" : "") + minutes + ":" +
            (seconds < 10 ? "0" : "") + seconds
        );
    }

    function updateTimer() {
          elapsedTime--;
        $('#timer').text(formatTime(elapsedTime));

        if (elapsedTime <= maxTime) {
            clearInterval(timerInterval);
            window.location.href = "/";
        }
    }


    // Iniciar o cronômetro automaticamente
    timerInterval = setInterval(updateTimer, 1000);
})











$(function () {
    $(".datetime").datetimepicker({})

    $('#images')
        .bind('cocoon:after-insert', function () {
            $(".date").datetimepicker({})
        })

    $('#nestable').nestable({})

    $('#image-sortable').nestable({
        maxDepth: 1
    })

    $('.nestable').on('change', function () {
        $.ajax({
            url: $(this).data('update-path'),
            type: 'POST',
            data:
                { nodes: $('.nestable').nestable('serialize') }
        })
    })

    $('.chosen-select').chosen(
        { no_results_text: "Oops, nenhum resultado encontrado!" }
    )

    $(":file").filestyle({
        classButton: "btn btn-default",
        buttonText: "Selecionar Arquivo",
        classInput: "form-control inline v-middle input-s"
    })

    $(".date").datetimepicker({
        format: 'DD/MM/YYYY',
        pickTime: false
    })

    $(".datetime").datetimepicker({
        format: 'DD/MM/YYYY hh:mm:ss',
        useSeconds: true,
    })

    if ($('.active').hasClass('item_menu')) {
        $('.active').parents('li').addClass('active')
    }

    $(".dropdown-toggle").click(function () {
        $(".dropdown-menu").slideToggle();
    });

    $("#phone_phone, #phone_field").inputmask("(99)[9]9999-9999").on("focusout", function () {
        var len = this.value.replace(/\D/g, '').length;
        $(this).inputmask(len > 10 ? "(99)[9]9999-9999" : "(99) 9999-9999");
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('.simple-form button[type=submit].btn-primary').on('click', function (event) {
        event.preventDefault();
        var el = $(this);
        el.prop('disabled', true);
        setTimeout(function () { el.prop('disabled', false); }, 3000);
    });

    var options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-center",
        preventDuplicates: true,
        onclick: null,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: 3000,
        extendedTimeOut: 1000,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    }

    if ($('.notice').text() !== "")
        toastr.success($('.notice').text(), "Sucesso!", options);

    if ($('.alert').text() !== "")
        toastr.error($('.alert').text(), "Falha!", options);

    // Função para verificar o pagamento apenas quando estiver no endpoint desejado
    function checkPaymentAtEndpoint() {
        // Verifica se a URL atual corresponde ao endpoint desejado
        if (window.location.pathname === "/area-member/pagamento") {
            // Chama a função de verificação de pagamento
            checkPayment();
        }
    }
    
    function checkPayment() {
        console.log("Verificando Pagamento");

        // Substitua 'payment_id' pelo ID real do pagamento que você deseja verificar
        const paymentId = document.getElementById("payment_id").value;

        // Faça uma solicitação AJAX para o seu servidor que consulta a API do Mercado Pago
        $.ajax({
            url: `/check_payment`,
            method: "GET",
            data: { payment_id: paymentId },
            success: function (data) {
                if (data.status) {
                    var paymentStatus = data.status
                    paymentStatus = 'approved'
                    // Verifica se o pagamento foi aprovado
                    if (paymentStatus === 'approved') {
                        console.log("Pagamento aprovado");
                        const quantity = document.getElementById("quantity").value;
                        const lotteryId= document.getElementById("lottery_id").value;
                        
                        $.ajax({
                            url: 'comprar',
                            method: 'PUT',
                            data: { lottery_id: lotteryId, quantity: quantity },
                            success: function (data) {
                                console.log(data.mensagem);
                                window.location.href = "/";
                            }
                            
                        });
                        
                    } else {
                        console.log("Status do pagamento: " + paymentStatus);
                    }
                } else {
                    console.error("Não foi possível obter o status do pagamento");
                }
            },
            error: function (error) {
                console.error("Erro ao verificar o pagamento:", error);
            }
        });
    }

    // Verifica o pagamento a cada 6 segundos
    setInterval(checkPaymentAtEndpoint, 10000);

});
