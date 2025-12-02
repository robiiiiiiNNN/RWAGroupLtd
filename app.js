document.addEventListener('DOMContentLoaded', () => {
    const navBar = document.getElementById('nav');

    document.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 0) {
            navBar.classList.add('moved');
        } else {
            navBar.classList.remove('moved');
        }
    })

    const body = document.body;


    const input = document.getElementById("cityInput");
    const words = ["Pervolia, Cyprus", "Oroklini, Cyprus", "Protaras, Cyprus"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        const displayedText = currentWord.substring(0, charIndex);
        input.setAttribute("placeholder", displayedText);

        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(typeEffect, 150);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeEffect, 150);
        } else {
            if (!isDeleting) {
                isDeleting = true;
                setTimeout(typeEffect, 1200);
            } else {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typeEffect, 300);
            }
        }
    }

    typeEffect();




    const apartment_dropdown = document.getElementById("apartment-dropdown");
    const apartment_dropdown_hover = document.getElementById('apartment-dropdown-hover');

    apartment_dropdown_hover.addEventListener('click', () => {
        if (apartment_dropdown.classList.contains('show')) {
            apartment_dropdown.classList.remove('show');
            apartment_dropdown.classList.add('hide');
        } else {
            apartment_dropdown.classList.remove('hide');
            apartment_dropdown.classList.add('show');
        }
    });
    fetch("apartments.json")
        .then(response => response.json())
        .then(data => {
            const newest = data.sort((a, b) => b.id - a.id).slice(0, 5);

            apartment_dropdown.innerHTML = newest.map(apartment => `
                <div class="apartment-item">
                    <img src="${apartment.cover}" alt="house-cover">
                    <h4>${apartment.title} <a href="">Read more <i class="fa-solid fa-arrow-up-right-from-square"></i></a> </h4>
                    <p id="first"><i class="fa-solid fa-bed"></i> ${apartment.bedrooms} Bedrooms · ${apartment.sqm} m²</p>
                    <p class="price">${apartment.price.toLocaleString()} €</p>
                    <p class="price"><i class="fa-solid fa-location-pin"></i> ${apartment.location}, Cyprus</p>
                </div>
            `).join("");
        })
        .catch(err => {
            console.error("Error loading apartments:", err);
            apartment_dropdown.innerHTML = "<p>Failed to load apartments.</p>";
        });


    fetch('apartments.json')
        .then(res => res.json())
        .then(data => {
            // Filter only properties marked as new
            const newProperties = data.filter(item => item.new);

            // Get the latest 5 new properties (from the end of the list)
            const latestFive = newProperties.slice(-3).reverse();

            // Target the container
            const container = document.querySelector('.properties');

            // Render the properties
            latestFive.forEach(property => {
                const div = document.createElement('div');
                div.classList.add('property-card');

                div.innerHTML = `
                <img src="${property.cover}" alt="${property.title}" style="margin-bottom: 15px;">
                <span style="margin-right: 20px; margin-bottom: 15px;"><i class="fa-solid fa-bed" style="margin-right: 10px; display: inline-block; margin-bottom: 15px;"></i>${property.bedrooms} Bedrooms</span>
                <span><i class="fa-solid fa-expand" style="margin-right: 10px;"></i>${property.sqm} sqm</span>
                <h3>${property.title}</h3>
                <span>€${property.price}</span>
                <span style="display: inline-block; margin-top: 10px; margin-left: 10px;"><i class="fa-solid fa-map-pin" style="margin-right: 10px;"></i>${property.location}</span>
            `;

                container.appendChild(div);
            });
        })
        .catch(error => console.error('Error loading apartments.json:', error));


    const track = document.querySelector('.carousel-track');
    const items = Array.from(track.children);
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev');

    let currentIndex = 0;

    function updateCarousel() {
        items.forEach(item => item.classList.remove('active'));

        items[currentIndex].classList.add('active');

        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
    }

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    updateCarousel();



    const jsonFile = "apartments.json";

    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.querySelectorAll(".houses").forEach(housesContainer => {
                const city = housesContainer.dataset.city;
                const filtered = data.filter(apartment =>
                    apartment.location.toLowerCase().includes(city.toLowerCase())
                );

                const topFive = filtered.slice(0, 4);
                const extraCount = filtered.length - 4;

                housesContainer.style.display = "flex";
                housesContainer.style.flexWrap = "wrap";
                housesContainer.style.gap = "10px";

                topFive.forEach(apartment => {
                    const img = document.createElement("img");
                    img.src = apartment.cover;
                    img.style.width = "130px";
                    img.style.aspectRatio = "1/1";
                    img.style.objectFit = "cover";
                    img.style.borderRadius = "10px";
                    img.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                    housesContainer.appendChild(img);
                });

                if (extraCount > 0) {
                    const moreDiv = document.createElement("div");
                    moreDiv.textContent = `+${extraCount}`;
                    moreDiv.style.width = "130px";
                    moreDiv.style.aspectRatio = "1/1";
                    moreDiv.style.display = "flex";
                    moreDiv.style.alignItems = "center";
                    moreDiv.style.justifyContent = "center";
                    moreDiv.style.fontSize = "30px";
                    moreDiv.style.fontFamily = "Montserrat";
                    moreDiv.style.fontWeight = "bold";
                    moreDiv.style.borderRadius = "10px";
                    moreDiv.style.color = "#242424";
                    moreDiv.style.transform = "translateX(-130px)";
                    moreDiv.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                    housesContainer.appendChild(moreDiv);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching JSON data:", error);
        });







});

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function addToFavorites(id) {
    if (!favorites.includes(id)) {
        favorites.push(id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function getFavorites() {
    const container = document.getElementById('favorites-container');
    container.innerHTML = '';
    
    if (favorites.length <= 0) {
        container.innerHTML = `Start Saving Listings`;
    } else {
        favorites.forEach(favorite => {
            const favoriteItem = document.createElement('div');
            favoriteItem.classList.add('favorite-item');
            favoriteItem.innerHTML = `<img src="${favorite}" alt="Favorite">`;
            container.appendChild(favoriteItem);
        });

    }
}


const saveBtn = document.getElementById('save');

saveBtn.addEventListener('click', (e) => {
    const favoriteId = params.get('id');
    addToFavorites(favoriteId);
});