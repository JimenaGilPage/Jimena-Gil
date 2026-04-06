/**
 * PORTAFOLIO VISUAL - JIMENA GIL
 * Archivo principal de JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. SELECCIÓN DE ELEMENTOS DEL DOM
    // ==========================================
    // Navegación y Menú
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    // Lightbox (Visor de fotos)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const images = document.querySelectorAll('.gallery-img');
    const closeBtn = document.querySelector('.close-btn');
    
    // Pantalla de carga
    const splash = document.getElementById('splash-screen');


    // ==========================================
    // 2. PANTALLA DE CARGA (SPLASH SCREEN)
    // ==========================================
    window.addEventListener('load', () => {
        setTimeout(() => {
            splash.classList.add('fade-out');
        }, 1500);
    });


    // ==========================================
    // 3. EFECTOS DE NAVEGACIÓN
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ==========================================
    // 4. MENÚ HAMBURGUESA (MÓVIL)
    // ==========================================
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });


    // ==========================================
    // 5. VISOR DE IMÁGENES (LIGHTBOX)
    // ==========================================
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let visibleImages = []; // Guardará solo las fotos no ocultadas por los filtros

    // Función para abrir el visor
    images.forEach((img) => {
        img.addEventListener('click', () => {
            // Filtramos las imágenes que están visibles en ese momento en la pantalla
            visibleImages = Array.from(images).filter(image => !image.classList.contains('hide'));
            
            // Buscamos qué número de foto (índice) acabamos de clickear
            currentIndex = visibleImages.indexOf(img);
            
            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
        });
    });

    // Función para cambiar de foto (Adelante o Atrás)
    function changeImage(direction) {
        if (visibleImages.length === 0) return;
        
        currentIndex += direction;
        
        // Si llegamos a la última, regresamos a la primera y viceversa
        if (currentIndex >= visibleImages.length) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = visibleImages.length - 1;
        }
        
        lightboxImg.src = visibleImages[currentIndex].src;
    }

    // Eventos para dar clic en las flechas
    if(nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => changeImage(1));
        prevBtn.addEventListener('click', () => changeImage(-1));
    }

    // Cerrar el visor
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Cerrar si hacemos clic en el fondo negro (pero no en la foto ni en las flechas)
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg && e.target !== prevBtn && e.target !== nextBtn) {
            lightbox.style.display = 'none';
        }
    });

    // Soporte para teclado (Flechas Izquierda/Derecha y Escape para salir)
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') {
                changeImage(1);
            } else if (e.key === 'ArrowLeft') {
                changeImage(-1);
            } else if (e.key === 'Escape') {
                lightbox.style.display = 'none';
            }
        }
    });

    // ==========================================
    // 7. FILTROS DINÁMICOS DE GALERÍA
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-grid > *'); 
    
    // NUEVO: Solo ejecutamos el filtro si existen los botones en la página actual
    if (filterBtns.length > 0) {
        
        // Al cargar la página, ocultamos de inicio las que NO queremos en "Destacado"
        galleryItems.forEach(item => {
            if (item.getAttribute('data-featured') !== 'true') {
                item.classList.add('hide');
            }
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(button => button.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    const isFeatured = item.getAttribute('data-featured') === 'true';
                    
                    if (filterValue === 'all') {
                        if (isFeatured) {
                            item.classList.remove('hide');
                            item.classList.add('visible');
                        } else {
                            item.classList.add('hide');
                        }
                    } else {
                        if (item.getAttribute('data-category') === filterValue) {
                            item.classList.remove('hide');
                            item.classList.add('visible'); 
                        } else {
                            item.classList.add('hide');
                        }
                    }
                });
            });
        });
    }

    // ==========================================
    // 8. ENVÍO DE FORMULARIO SIN RECARGAR LA PÁGINA
    // ==========================================
    const form = document.getElementById("my-form");
    const status = document.getElementById("my-form-status");

    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault(); // Evita que la página te mande a Formspree

            // Cambia el texto del botón mientras envía
            const btn = form.querySelector('button');
            const btnOriginalText = btn.innerText;
            btn.innerText = "Enviando...";

            const data = new FormData(event.target);

            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json' // Le dice a Formspree que responda en silencio
                }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "¡Gracias! Tu mensaje ha sido enviado con éxito.";
                    status.className = "status-success";
                    status.style.display = "block";
                    form.reset(); // Limpia los campos del formulario
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            status.innerHTML = "Oops! Hubo un problema al enviar tu formulario.";
                        }
                        status.className = "status-error";
                        status.style.display = "block";
                    })
                }
            }).catch(error => {
                status.innerHTML = "Oops! Hubo un problema al enviar tu formulario.";
                status.className = "status-error";
                status.style.display = "block";
            }).finally(() => {
                btn.innerText = btnOriginalText; // Regresa el botón a la normalidad
                
                // Oculta el mensaje de gracias después de 5 segundos
                setTimeout(() => {
                    status.style.display = "none";
                }, 5000);
            });
        });
    }

}); // <-- ESTA ES LA LLAVE DE CIERRE FINAL