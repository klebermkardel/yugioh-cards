let allCards = [];
let filteredCards = [];
let currentPage = 1;
const cardsPerPage = 20;

fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')
    .then(response => response.json())
    .then(data => {
        allCards = data.data;
        filteredCards = allCards;

        renderCards(filteredCards);
        updatePageInfo(filteredCards);

        // Função para renderizar cards com ajuste para exibir ATK/DEF só em monstros
        function renderCards(cards) {
            const cardsContainer = document.getElementById('cards-container');
            cardsContainer.innerHTML = '';

            const start = (currentPage - 1) * cardsPerPage;
            const end = start + cardsPerPage;
            const cardsToShow = cards.slice(start, end);

            cardsToShow.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');

                // Detecta se o card é Monstro (tipo contém "Monster")
                const isMonster = card.type.toLowerCase().includes('monster');

                // Monta o conteúdo condicional
                let atkDefHtml = '';
                if (isMonster) {
                    atkDefHtml = `<p><strong>ATK:</strong> ${card.atk} | <strong>DEF:</strong> ${card.def}</p>`;
                } else {
                    atkDefHtml = `<p><strong>Tipo:</strong> ${card.type}</p>`;
                }

                cardElement.innerHTML = `
                    <img src="${card.card_images[0].image_url}" alt="${card.name}" />
                    <h2>${card.name}</h2>
                    ${atkDefHtml}
                    <p>${card.desc}</p>
                    <button class="favorite-btn" data-id="${card.id}"
                `;

                // Adiciona o evento de clique ao card
                cardElement.addEventListener('click', () => showCardModal(card));

                cardsContainer.appendChild(cardElement);
            });
        }

        function showCardModal(card) {
            const modal = document.getElementById('cardModal');
            const modalBody = document.getElementById('modalBody');

            modalBody.innerHTML = `
                <img src="${card.card_images[0].image_url}" alt="${card.name}">
                <h2>${card.name}</h2>
                <p><strong>Tipo:</strong> ${card.type}</p>
                <p><strong>Atributo:</strong> ${card.attribute ?? 'N/A'}</p>
                <p><strong>Nível:</strong> ${card.level ?? 'N/A'}</p>
                <p><strong>ATK:</strong> ${card.atk ?? 'N/A'}</p>
                <p><strong>DEF:</strong> ${card.def ?? 'N/A'}</p>
                <p><strong>Descrição:</strong> ${card.desc}</p>
            `;

            modal.style.display = 'block';
            }

            document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('cardModal').style.display = 'none';
            });

            window.addEventListener('click', (e) => {
            const modal = document.getElementById('cardModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });


        function updatePageInfo(cards) {
            document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${Math.ceil(cards.length / cardsPerPage)}`;
        }

        // Função para aplicar filtros (busca + tipo + atributo)
        function applyFilters() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const typeFilter = document.getElementById('typeFilter').value;
            const attributeFilter = document.getElementById('attributeFilter').value;
            const levelFilter = document.getElementById('levelFilter').value;

            filteredCards = allCards.filter(card => {
                const matchSearch = card.name.toLowerCase().includes(searchTerm) || card.desc?.toLowerCase().includes(searchTerm);

                let matchType = true;
                if (typeFilter === 'monster') {
                    matchType = card.type.toLowerCase().includes('monster');
                } else if (typeFilter === 'spell') {
                    matchType = card.type.toLowerCase().includes('spell');
                } else if (typeFilter === 'trap') {
                    matchType = card.type.toLowerCase().includes('trap');
                }

                let matchAttribute = true;
                if (attributeFilter !== 'all') {
                    // Nem todos os cards têm atributo, então cheque se existe antes
                    matchAttribute = card.attribute && card.attribute === attributeFilter;
                }

                let matchLevel = true;
                if (levelFilter !== 'all') {
                    const cardLevel = card.level ?? card.linkval ?? card.rank ?? null;
                    matchLevel = cardLevel !== null && cardLevel == levelFilter;
                }

                 const sortFilter = document.getElementById('sortFilter').value;

                if (sortFilter !== 'none') {
                const [key, order] = sortFilter.split('-');

                filteredCards.sort((a, b) => {
                    let valA = a[key] ?? 0;
                    let valB = b[key] ?? 0;

                    // Se for nome, converte para lowercase
                    if (key === 'name') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                    }

                    if (valA < valB) return order === 'asc' ? -1 : 1;
                    if (valA > valB) return order === 'asc' ? 1 : -1;
                    return 0;
                });
                }

                return matchSearch && matchType && matchAttribute && matchLevel;
            });

            currentPage = 1;
            renderCards(filteredCards);
            updatePageInfo(filteredCards);
        }

        // Eventos para os filtros e busca
        const debounce = (func, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func(...args), delay);
            };
        };

        const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('input', debounce(applyFilters, 300));
            document.getElementById('typeFilter').addEventListener('change', applyFilters);
            document.getElementById('attributeFilter').addEventListener('change', applyFilters);
            document.getElementById('levelFilter').addEventListener('change', applyFilters);
            document.getElementById('sortFilter').addEventListener('change', applyFilters);


        // Paginação
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderCards(filteredCards);
                updatePageInfo(filteredCards);
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            if (currentPage < Math.ceil(filteredCards.length / cardsPerPage)) {
                currentPage++;
                renderCards(filteredCards);
                updatePageInfo(filteredCards);
            }
        });

    })
    .catch(error => {
        console.error('Erro ao buscar dados da API:', error);
    });
