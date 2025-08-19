var localCarrinho = localStorage.getItem("carrinho");

if (localCarrinho) {
  var carrinho = JSON.parse(localCarrinho);
  if (carrinho.length > 0) {
    //Tem items, renderiza
    renderizarCarrinho();
    //Soma os produtos.
    calcularTotal();
  } else {
    //Mostra carrinho vazio
    carrinhoVazio();
  }
} else {
  //Mostra carrinho vazio
  carrinhoVazio();
}

function renderizarCarrinho() {
  //Esvaziar a area dos itens
  $("#listaCarrinho").empty();

  //Percorrer o carrinho e alimentar
  $.each(carrinho, function (index, itemCarrinho) {
    var itemDiv = `
                        <!--item Carrinho-->
                        <div class="item-carrinho">
                            <div class="area-img">
                                <img src="${
                                  itemCarrinho.item.imagem
                                }" alt="imagem default">
                            </div>
                            <div class="area-details">
                                <div class="sup">
                                    <span class="name-prod">${
                                      itemCarrinho.item.nome
                                    }</span>
                                    <a data-index="${index}" class="delete-item" href="#"><i class="mdi mdi-close"></i></a>
                                </div>
                                <div class="middle">
                                    <span>${
                                      itemCarrinho.item.principal_caracteristica
                                    }</span>
                                </div>
                                <div class="preco-quantidade">
                                    <span>${itemCarrinho.item.preco_promocional.toLocaleString(
                                      "pt-BR",
                                      {
                                        style: "currency",
                                        currency: "BRL",
                                      }
                                    )}</span>
                                    <div class="count">
                                        <a class="minus" data-index="${index}" href="#">-</a>
                                        <input readonly class="qtd-item" type="text" value="${
                                          itemCarrinho.quantidade
                                        }">
                                        <a class="plus" data-index="${index}" href="#">+</a>
                                    </div>
                                </div>
                            </div>
                        </div>
    `;

    $("#listaCarrinho").append(itemDiv);
  });

  //Deletar itens
  $(".delete-item").on("click", function () {
    var index = $(this).data("index");
    console.log("O indice é: ", index);

    //Confirmar
    app.dialog.confirm(
      "Tem certeza que quer remover este item?",
      "<strong>REMOVER</strong>",
      function () {
        //Remover o item do carrinho
        carrinho.splice(index, 1);
        //Atualizar carrinho com item removido
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        //Atualiza a pagina
        app.views.main.router.refreshPage();
      }
    );
  });

  //Deletar itens botão(-)
  $(".minus").on("click", function () {
    var index = $(this).data("index");
    console.log("O indice é: ", index);

    //Se tem mais de um item na quantidade
    if (carrinho[index].quantidade > 1) {
      carrinho[index].quantidade--;
      carrinho[index].total_item =
        carrinho[index].quantidade * carrinho[index].item.preco_promocional;
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      app.views.main.router.refreshPage();
    } else {
      var itemname = carrinho[index].item.nome;
      app.dialog.confirm(
        `Gostaria de Remover <strong>${itemname}</strong>?`,
        "REMOVER",
        function () {
          carrinho.splice(index, 1);
          localStorage.setItem("carrinho", JSON.stringify(carrinho));
          renderizarCarrinho();
          calcularTotal();
        }
      );
    }
  });

  //Add itens botão(+)
  $(".plus").on("click", function () {
    var index = $(this).data("index");
    console.log("O indice é: ", index);

    carrinho[index].quantidade++;
    carrinho[index].total_item =
      carrinho[index].quantidade * carrinho[index].item.preco_promocional;

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderizarCarrinho();
    calcularTotal();
  });
}

function calcularTotal() {
  var totalCarrinho = 0;
  $.each(carrinho, function (index, itemCarrinho) {
    totalCarrinho += itemCarrinho.total_item;
  });
  //Mostrar o Total
  $("#subtotal").html(
    totalCarrinho.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  );
}

function carrinhoVazio() {
  console.log("Carrinho está vazio");

  //Esvaziar lista carrinho
  $("#listaCarrinho").empty();

  //Sumir o botão e totais
  $("#toolbarTotais").addClass("display-none");
  $("#toolbarCheckout").addClass("display-none");

  //Mostrar Sacola vazia
  $("#listaCarrinho").html(`
    <div class="text-align-center">
    <img width="300px" src="img/empty.gif">
    <br><span class="color-gray" >Nada por enquanto...</span>
    </div>
    `);
}

// Esvaziar carrinho
$("#esvaziar").on("click", function () {
  app.dialog.confirm(
    "Quer mesmo esvaziar o carrinho?",
    "<strong>ESVAZIAR</strong>",
    function () {
      //Apagar localStorage do carrinho
      localStorage.removeItem("carrinho");
      app.views.main.router.refreshPage();
    }
  );
});
