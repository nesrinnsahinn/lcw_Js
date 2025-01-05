(() => {
    const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    let products = []
    let favorites = []
    let carouselPosition = 0;
    const init = async () => {
        await fetchData();
        fetchFavorites();
        buildHTML();
        buildCSS();
        setEvents();
    };

    const fetchData = async () => {
        return new Promise(async(resolve) => {
            if(localStorage.getItem('products')) {products = JSON.parse(localStorage.getItem('products')); resolve(true)}
            else {
                try {
                    const response = await fetch(API_URL);
                    if (!response.ok) {
                        throw new Error("Veri alınırken hata oluştu");
                    }
                    const data = await response.json();
                    localStorage.setItem("products", JSON.stringify(data)); 
                    products = data;
                    resolve(true)
                } catch (error) {
                    console.error("Veri çekme hatası:", error);
                    products =  [];
                    resolve(true)
                }
            }
        })
    }

    const fetchFavorites = async () => {
        if(localStorage.getItem('favorites')) favorites = JSON.parse(localStorage.getItem('favorites'))
        else favorites = []
        console.log(favorites)
    }

    const buildHTML = () => {
        const html = `
            <div class="container">
                <h1>Benzer Ürünler</h1>
                <div class="container-inner">
                    <div class="carousel-side-arrow left">
                        <i class="fa-solid fa-chevron-left"></i>
                    </div>
                    <div class="carousel-display">
                        ${products
                            .map(
                            (product, index) => `
                            <div class="carousel-card carousel-item-${index}" data-url=${product.url}>
                                <img src="${product.img}" alt="${product.name}" style="width: 100%; height: 230px; object-fit: cover;">
                                <button class="favorite-btn" data-id="${product.id}">
                                    <i class="${favorites.includes(String(product.id)) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                                </button>
                                <div class="product-info">
                                    <div>
                                        <span class="product-name" :title="${product.name}">${product.name}</span>
                                        <span class="product-price">${product.price} TRY</span>
                                    </div>
                                </div>
                            </div>
                            `
                        )
                        .join("")}
                    </div>
                    <div class="carousel-side-arrow right">
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </div>
            </div>
        `;

        $('.product-detail').empty().append(html);
    };

    const buildCSS = () => {
        /* Fontawesome */
        var link = $('<link>', {
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css',
            integrity: 'sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==',
            crossorigin: 'anonymous',
            referrerpolicy: 'no-referrer'
        });
        $('head').append(link);

        const css = `
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
            body {
                font-family: "Open Sans", serif;
                margin: 0;
                padding: 0;
            }
            .product-detail {
                background-color: #faf9f7;
                height: 400px;
                width: 100%;
                display: flex;
                justify-content: center;
            }
            .container {
                max-width: 1450px;
                width: 100%;
                padding: 15px 20px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .container > h1 {
                font-weight: 100;
                font-size: 28px;
                padding: 0px 30px;
                margin: 0;
            }
            .container-inner {
                height: 100%;
                display: flex;
                flex-direction: row;
                position: relative;
            }
            .carousel-side-arrow {
                width: 30px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .carousel-display {
                display: flex;
                flex: 1;
                gap: 16px;
                overflow-x: auto;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
            }

            .carousel-card {
                width: 200px;
                min-width: 200px;
                height: 100%;
                background: white;
                position: relative;
                display: flex;
                flex-direction: column;
                cursor:pointer;
                transition: .3s;
            }
            

            .carousel-display::-webkit-scrollbar {
                width: 0px;
                height: 0px;
            }

            .favorite-btn {
                width: 35px;
                height: 35px;
                text-align: center;
                font-size: 23px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                border: solid 1px #d7d7d8;
                border-radius: 4px;
                -webkit-box-shadow: 0px 4px 17px -8px rgba(82, 82, 82, 1);
                -moz-box-shadow: 0px 4px 17px -8px rgba(82, 82, 82, 1);
                box-shadow: 0px 4px 17px -8px rgba(82, 82, 82, 1);
                position: absolute;
                top: 6px;
                right: 10px;
            }

            .fa-solid.fa-heart {
                color: #0090ff; 
            }

            .product-info {
                width: 100%;
                display: flex;
                flex: auto;
            }
            .product-info > div {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 0px 10px;
            }

            .product-name {
                margin-top: 5px;
                font-size: 13px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            
            .product-price {
                margin-bottom: 10px;
                color: #4359bd;
                font-weight: 500;
            }
        `;
        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };

    const setEvents = () => {
        $('.carousel-side-arrow.left').on('click', () => {
            if(carouselPosition <= 0) return;
            carouselPosition--;
            $('.carousel-display').animate({scrollLeft: $(`.carousel-item-${carouselPosition}`)[0].offsetLeft - 30}, 0);
        });

        $('.carousel-side-arrow.right').on('click', () => {
            if($('.carousel-display')[0].scrollWidth - $('.carousel-display')[0].scrollLeft <= $('.carousel-display')[0].offsetWidth) return false;
            if((carouselPosition + 1) >= products.length) return false;
            carouselPosition++;
            $('.carousel-display').animate({scrollLeft: $(`.carousel-item-${carouselPosition}`)[0].offsetLeft - 30}, 0);
        });

        $('.carousel-card').on('click', (event) => {
            const productURL = event.currentTarget.getAttribute('data-url');
            window.open(productURL, '_blank').focus();
        })

        $('.favorite-btn').on('click', (event) => {
            event.stopPropagation()
            const productId = event.currentTarget.getAttribute('data-id');
            const icon = event.currentTarget.querySelector('.fa-heart');
            if (favorites.includes(productId)) {
                favorites = favorites.filter(id => id !== productId);
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            } else {
                favorites.push(productId);
                icon.classList.add('fa-solid');
                icon.classList.remove('fa-regular');
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        })
    };

    init();
})();