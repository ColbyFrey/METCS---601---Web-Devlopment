import { calculateBMI, getBMICategory } from './bmiModule.js';

const unitSelect = document.getElementById('unit');
const metricFields = document.getElementById('metricFields');
const imperialFields = document.getElementById('imperialFields');
const form = document.getElementById('bmiForm');
const resultDiv = document.getElementById('result');
const resetBtn = document.getElementById('resetBtn');

unitSelect.addEventListener('change', () => {
    const unit = unitSelect.value;
    if (unit === 'metric') {
        metricFields.classList.remove('hidden');
        imperialFields.classList.add('hidden');
    } else {
        metricFields.classList.add('hidden');
        imperialFields.classList.remove('hidden');
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const unit = unitSelect.value;
    let bmi = 0;
    let heightText = '', weightText = '';

    if (unit === 'metric') {
        const height = parseFloat(document.getElementById('cm').value);
        const weight = parseFloat(document.getElementById('kg').value);
        if (!height || !weight) return;
        bmi = calculateBMI({ height, weight, unit });
        heightText = `${height} cm`;
        weightText = `${weight} kg`;
    } else {
        const feet = parseFloat(document.getElementById('feet').value);
        const inches = parseFloat(document.getElementById('inches').value);
        const weight = parseFloat(document.getElementById('lbs').value);
        if (!feet || inches === undefined || !weight) return;
        bmi = calculateBMI({ height: { feet, inches }, weight, unit });
        heightText = `${feet} feet ${inches} inch${inches !== 1 ? 'es' : ''}`;
        weightText = `${weight} pounds`;
    }

    const category = getBMICategory(bmi);

    // Update result view
    document.getElementById('bmiValue').textContent = bmi;
    document.getElementById('bmiCategory').textContent = category;
    document.getElementById('enteredInfo').innerHTML = `<strong>Height:</strong> ${heightText} &nbsp;&nbsp; <strong>Weight:</strong> ${weightText}`;

    // Show results, hide form
    document.getElementById('formView').classList.add('hidden');
    document.getElementById('resultView').classList.remove('hidden');
});


resetBtn.addEventListener('click', () => {
    form.reset();
    resultDiv.textContent = '';
    metricFields.classList.add('hidden');
    imperialFields.classList.remove('hidden');
});
