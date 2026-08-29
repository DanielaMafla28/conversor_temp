document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const tempInput = document.getElementById('temperature-input');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    const swapBtn = document.getElementById('swap-btn');
    const convertBtn = document.getElementById('convert-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const errorMessage = document.getElementById('error-message');
    const statusIcon = document.getElementById('status-icon');

    // Lógica principal de conversión
    function convertTemperature() {
        // Limpiar errores previos
        errorMessage.textContent = '';
        const inputValue = tempInput.value.trim();

        // Validación 1: Entrada vacía
        if (inputValue === '') {
            showError('Por favor, ingresa un valor numérico.');
            return;
        }

        const temp = parseFloat(inputValue);

        // Validación 2: No es un número
        if (isNaN(temp)) {
            showError('El valor ingresado no es válido.');
            return;
        }

        const from = fromUnit.value;
        const to = toUnit.value;
        let result = 0;
        let tempInCelsius = 0; // Para el indicador visual (frío/calor)

        // Si las unidades son iguales
        if (from === to) {
            result = temp;
            tempInCelsius = (from === 'C') ? temp : (from === 'F' ? (temp - 32) * 5/9 : temp - 273.15);
        } else {
            // Conversiones desde Celsius
            if (from === 'C') {
                tempInCelsius = temp;
                if (to === 'F') result = (temp * 9/5) + 32;
                if (to === 'K') result = temp + 273.15;
            }
            // Conversiones desde Fahrenheit
            else if (from === 'F') {
                tempInCelsius = (temp - 32) * 5/9;
                if (to === 'C') result = tempInCelsius;
                if (to === 'K') result = tempInCelsius + 273.15;
            }
            // Conversiones desde Kelvin
            else if (from === 'K') {
                // Validación 3: El cero absoluto
                if (temp < 0) {
                    showError('La temperatura en Kelvin no puede ser menor a 0.');
                    return;
                }
                tempInCelsius = temp - 273.15;
                if (to === 'C') result = tempInCelsius;
                if (to === 'F') result = (tempInCelsius * 9/5) + 32;
            }
        }

        displayResult(result, to, tempInCelsius);
    }

    // Mostrar el resultado y actualizar la UI
    function displayResult(value, unit, celsiusEquivalent) {
        // Formatear a máximo 2 decimales
        const formattedValue = Number.isInteger(value) ? value : value.toFixed(2);
        
        let unitSymbol = '';
        if (unit === 'C') unitSymbol = '°C';
        if (unit === 'F') unitSymbol = '°F';
        if (unit === 'K') unitSymbol = 'K';

        resultText.textContent = `${formattedValue} ${unitSymbol}`;
        
        // Actualizar colores basados en la temperatura (referencia: Celsius)
        updateVisualIndicator(celsiusEquivalent);

        // Activar animación
        resultContainer.classList.remove('show');
        // Pequeño timeout para reiniciar la animación en CSS
        setTimeout(() => {
            resultContainer.classList.add('show');
        }, 50);
    }

    // Actualizar icono y borde según si hace frío o calor
    function updateVisualIndicator(celsius) {
        // Remover clases previas
        statusIcon.classList.remove('is-hot', 'is-cold', 'is-neutral');
        resultContainer.classList.remove('border-hot', 'border-cold');

        if (celsius >= 30) {
            statusIcon.classList.add('is-hot');
            resultContainer.classList.add('border-hot');
            statusIcon.className = 'fa-solid fa-temperature-full header-icon is-hot';
        } else if (celsius <= 15) {
            statusIcon.classList.add('is-cold');
            resultContainer.classList.add('border-cold');
            statusIcon.className = 'fa-solid fa-temperature-empty header-icon is-cold';
        } else {
            statusIcon.classList.add('is-neutral');
            statusIcon.className = 'fa-solid fa-temperature-half header-icon is-neutral';
        }
    }

    // Mostrar mensajes de error
    function showError(message) {
        errorMessage.textContent = message;
        resultContainer.classList.remove('show');
        statusIcon.className = 'fa-solid fa-temperature-half header-icon';
    }

    // Función para intercambiar unidades
    function swapUnits() {
        const tempUnit = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempUnit;
        
        // Si hay un valor ingresado, convertir automáticamente al intercambiar
        if (tempInput.value !== '') {
            convertTemperature();
        }
    }

    // Función para limpiar todo
    function clearAll() {
        tempInput.value = '';
        errorMessage.textContent = '';
        resultContainer.classList.remove('show');
        statusIcon.className = 'fa-solid fa-temperature-half header-icon';
        fromUnit.value = 'C';
        toUnit.value = 'F';
    }

    // Event Listeners
    convertBtn.addEventListener('click', convertTemperature);
    swapBtn.addEventListener('click', swapUnits);
    clearBtn.addEventListener('click', clearAll);
    
    // Permitir convertir al presionar la tecla "Enter"
    tempInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertTemperature();
        }
    });
});