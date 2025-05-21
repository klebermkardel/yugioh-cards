let allCards = [];
let currentPage = 1;
const cardsPerPage = 20;

fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
    .then(response => response.json())
    .then(data => {
        // Função para exibir 20 cards por página
        function renderCards() {
            const cardsContainer = document.getElementById('cards-container');
            cardsContainer.innerHTML = ''; // Limpa antes de inserir
    
            const start = (currentPage - 1) * cardsPerPage;
            const end = start + cardsPerPage;
            const cardsToShow = allCards.slice(start, end);
    
            cardsToShow.forEach(card => {
                // Cria um elemento div para o card
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
    
                // Insere conteúdo HTML no card
                cardElement.innerHTML = `
                <img src="${card.card_images[0].image_url}" alt="${card.name}" />
                <h2>${card.name}</h2>
                <p><strong>ATK:</strong> ${card.atk} | <strong>DEF:</strong> ${card.def}</p>
                <p>${card.desc}</p>
                `;
    
                // Adiciona o card ao container
                cardsContainer.appendChild(cardElement);
            });
        }
        
        allCards = data.data;
        renderCards();
        upadatePageInfo();

        document.getElementById('prevBtn').addEventListener('click', () => {
            if(currentPage > 1) {
                currentPage--;
                renderCards();
                upadatePageInfo();
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            if(currentPage < Math.ceil(allCards.length / cardsPerPage)) {
                currentPage++;
                renderCards();
                upadatePageInfo();
            }
        });

        function upadatePageInfo() {
            document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${Math.ceil(allCards.length / cardsPerPage)}`;
        };
    })
    .catch(error => {
        console.error('Erro ao buscar dados da API:', error); // Exibe mensagem de erro caso retorne algum erro ao buscar dados da API
    });

