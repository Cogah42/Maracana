document.addEventListener("DOMContentLoaded", () => {
    const promoButtons = document.querySelectorAll(".promo-button");
    const flavorSection = document.querySelector(".flavor-section");
    const promoSection = document.querySelector(".promo-section"); // Seção de promoções
    const checkoutSection = document.querySelector(".checkout-section");

    const flavor1 = document.getElementById("flavor1");
    const flavor2 = document.getElementById("flavor2");
    const nextToCheckout = document.getElementById("next-to-checkout");

    const cepInput = document.getElementById("cep");
    const numberInput = document.getElementById("number");
    const referenceInput = document.getElementById("reference");
    const searchAddressButton = document.getElementById("search-address");
    const manualAddressInput = document.getElementById("manual-address");
    const useLocationButton = document.getElementById("use-location");

    const paymentMethod = document.getElementById("payment-method");
    const changeSection = document.getElementById("change-section");
    const changeInput = document.getElementById("change");

    const orderDetails = document.getElementById("order-details");
    const orderTotal = document.getElementById("order-total");
    const finalizeOrder = document.getElementById("finalize-order");

    const leftHalfImg = document.getElementById("left-half");
    const rightHalfImg = document.getElementById("right-half");

    let selectedPromo = "";
    let totalPrice = 0;

    // Função para atualizar as imagens dos sabores
    function updatePizzaImage() {
        const flavor1Value = flavor1.value;
        const flavor2Value = flavor2.value;

        if (flavor1Value) {
            const flavor1Image = flavor1.options[flavor1.selectedIndex].getAttribute("data-image");
            leftHalfImg.src = `_images/${flavor1Image}`;
            leftHalfImg.alt = flavor1Value;
        } else {
            leftHalfImg.src = "_images/default.png";
            leftHalfImg.alt = "Sabor 1";
        }

        if (flavor2Value) {
            const flavor2Image = flavor2.options[flavor2.selectedIndex].getAttribute("data-image");
            rightHalfImg.src = `_images/${flavor2Image}`;
            rightHalfImg.alt = flavor2Value;
        } else {
            rightHalfImg.src = "_images/default.png";
            rightHalfImg.alt = "Sabor 2";
        }
    }

    // Atualiza a imagem quando o sabor é alterado
    flavor1.addEventListener("change", updatePizzaImage);
    flavor2.addEventListener("change", updatePizzaImage);

    promoButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedPromo = button.dataset.promo;
            totalPrice = parseFloat(button.dataset.price);
            
            // Esconde a seção de promoções e mostra a de sabores
            promoSection.classList.add("hidden"); // Adiciona a classe hidden na seção de promoções
            flavorSection.classList.remove("hidden"); // Remove a classe hidden da seção de sabores
        });
    });

    nextToCheckout.addEventListener("click", () => {
        const flavor1Text = flavor1.value || "Nenhum";
        const flavor2Text = flavor2.value || "Nenhum";

        flavorSection.classList.add("hidden");
        checkoutSection.classList.remove("hidden");

        orderDetails.innerText = `Promoção: ${selectedPromo}\nSabores: ${flavor1Text} e ${flavor2Text}`;
        orderTotal.innerText = `Total: R$ ${totalPrice.toFixed(2)}`;
    });

    // Função de busca do endereço
    searchAddressButton.addEventListener("click", async () => {
        const cep = cepInput.value.trim();
        const number = numberInput.value.trim();
        if (!cep || !number) {
            alert("Por favor, preencha o CEP e número da casa.");
            return;
        }
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (data.erro) throw new Error("CEP não encontrado.");
            manualAddressInput.value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}, nº ${number}. ${referenceInput.value ? 'Referência: ' + referenceInput.value : ''}`;
        } catch (error) {
            alert("Erro ao buscar endereço: " + error.message);
        }
    });

    // Função para usar a localização atual
    useLocationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`)
                    .then(response => response.json())
                    .then(data => {
                        const address = data.address;
                        manualAddressInput.value = `${address.road || ''}, ${address.suburb || ''}, ${address.city || ''}, ${address.state || ''}, ${address.country || ''}, nº ${numberInput.value || ''}. ${referenceInput.value ? 'Referência: ' + referenceInput.value : ''}`;
                    })
                    .catch(() => {
                        alert("Erro ao buscar o endereço com base na localização.");
                    });
            }, () => {
                alert("Erro ao acessar a localização.");
            });
        } else {
            alert("Geolocalização não suportada.");
        }
    });

    paymentMethod.addEventListener("change", () => {
        if (paymentMethod.value === "Pix") {
            changeSection.classList.add("hidden");
        } else {
            changeSection.classList.toggle("hidden", paymentMethod.value !== "Dinheiro");
        }
    });

    finalizeOrder.addEventListener("click", () => {
        const address = manualAddressInput.value.trim();
        if (!address) {
            alert("Por favor, forneça um endereço válido!");
            return;
        }
        const payment = paymentMethod.value;
        const change = payment === "Dinheiro" ? `Troco para: R$ ${changeInput.value}` : "Sem troco";
        const message = `Olá! Gostaria de pedir:\n${orderDetails.innerText}\nEndereço: ${address}\nForma de Pagamento: ${payment}\n${change}\nTotal: R$ ${totalPrice.toFixed(2)}`;

        
            const whatsappURL = `https://wa.me/5522998583559?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, "_blank");
        
    });

    // Chama a função para atualizar as imagens inicialmente
    updatePizzaImage();
});
