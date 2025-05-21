let allCards = [];               // Armazena todos os cards recebidos da API
let filteredCards = [];          // Armazena os cards filtrados por busca
let currentPage = 1;             // Página atual
const cardsPerPage = 20;         // Quantidade de cards por página

fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
    .then(response => response.json())
    .then(data => {
        allCards = data.data;              // Salva todos os cards recebidos da API
        filteredCards = allCards;          // Inicialmente, os cards filtrados são todos os cards

        renderCards(filteredCards);        // Renderiza a primeira página
        updatePageInfo(filteredCards);     // Atualiza a informação da página

        // Função para renderizar os cards de acordo com a página atual e filtro
        function renderCards(cards) {
            const cardsContainer = document.getElementById('cards-container');
            cardsContainer.innerHTML = '';  // Limpa os cards anteriores

            const start = (currentPage - 1) * cardsPerPage;  // Índice inicial
            const end = start + cardsPerPage;                // Índice final
            const cardsToShow = cards.slice(start, end);     // Pega os cards da página atual

            cardsToShow.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');

                // Monta o HTML de cada card
                cardElement.innerHTML = `
                    <img src="${card.card_images[0].image_url}" alt="${card.name}" />
                    <h2>${card.name}</h2>
                    <p><strong>ATK:</strong> ${card.atk} | <strong>DEF:</strong> ${card.def}</p>
                    <p>${card.desc}</p>
                `;

                cardsContainer.appendChild(cardElement);  // Adiciona o card ao container
            });
        }

        // Atualiza o texto da página atual
        function updatePageInfo(cards) {
            const pageInfo = document.getElementById('pageInfo');
            pageInfo.textContent = `Página ${currentPage} de ${Math.ceil(cards.length / cardsPerPage)}`;
        }

        // Evento do botão "Anterior"
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderCards(filteredCards);
                updatePageInfo(filteredCards);
            }
        });

        // Evento do botão "Próxima"
        document.getElementById('nextBtn').addEventListener('click', () => {
            if (currentPage < Math.ceil(filteredCards.length / cardsPerPage)) {
                currentPage++;
                renderCards(filteredCards);
                updatePageInfo(filteredCards);
            }
        });

        // Campo de busca — filtra os cards conforme o usuário digita
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            filteredCards = allCards.filter(card =>
                card.name.toLowerCase().includes(searchTerm)
            );

            currentPage = 1; // Volta para a primeira página ao buscar
            renderCards(filteredCards);
            updatePageInfo(filteredCards);
        });
    })
    .catch(error => {
        console.error('Erro ao buscar dados da API:', error);
    });
