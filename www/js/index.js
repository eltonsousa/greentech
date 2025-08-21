fetch(
  "https://raw.githubusercontent.com/eltonsousa/bd_produtos_teste/refs/heads/master/banco-de-dados.json"
)
  .then((reponse) => reponse.json())
  .then((data) => {
    //Salvar os dados vindo do back-end localmente
    //Vamos utilizar Local storage
    localStorage.setItem("produtos", JSON.stringify(data));
    console.log("dados salvos no Local Storage");

    // Simula carregamento Online
    setTimeout(() => {
      // Esvazia Área de produtos
      $("#produtos").empty();

      data.forEach((produto) => {
        var produtoHTML = `
        <!-- Item Cards -->
        <div class="item-card">
        <a data-id="${produto.id}" href="#" class="item">
        <div class="img-container">
            <img src="${produto.imagem}" alt="">
        </div>
        <div class="nome-rating">
            <span class="nome-prod color-gray">${produto.nome}</span>
            <span class="bold">
                <i class="mdi mdi-star"></i>
                ${produto.rating}
            </span>
        </div>
        <div class="price">${produto.preco_promocional.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</div>
        </a>
        </div>
        `;
        $("#produtos").append(produtoHTML);
      });

      $(".item").on("click", function () {
        var id = $(this).attr("data-id");
        localStorage.setItem("detalhe", id);
        app.views.main.router.navigate("/detalhes/");
      });
    }, 600);
  })
  .catch((error) => console.error("erro ao fazer fetch dos dados: " + error));

//Verificar quantos itens tem no carrinho
setTimeout(() => {
  var carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  //alimentar o contador
  $(".btn-cart").attr("data-count", carrinho.length);
}, 300);
