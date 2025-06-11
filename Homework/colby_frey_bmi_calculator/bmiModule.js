export function calculateBMI({ height, weight, unit }) {
    let bmi = 0;

    if (unit === 'metric') {
        const heightM = height / 100;
        bmi = weight / (heightM * heightM);
    } else {
        const heightIn = height.feet * 12 + height.inches;
        bmi = (weight / (heightIn * heightIn)) * 703;
    }

    return bmi.toFixed(2);
}

export function getBMICategory(bmi) {
    const value = parseFloat(bmi);
    if (value < 18.5) return 'Underweight';
    if (value < 25) return 'Healthy Weight';
    if (value < 30) return 'Overweight';
    if (value < 35) return 'Class 1 Obesity';
    if (value < 40) return 'Class 2 Obesity';
    return 'Class 3 Obesity (Severe)';
}
