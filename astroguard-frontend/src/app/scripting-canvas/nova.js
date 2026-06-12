// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Chart.js for Historical Luminosity Curve
    const ctx = document.getElementById('luminosityChart').getContext('2d');
    
    // Generate mock data for the curve
    const generateData = () => {
        const data = [];
        let value = 20;
        // Ascending phase (Cyan)
        for (let i = 0; i < 15; i++) {
            value += Math.random() * 5 + 2;
            data.push({ x: i, y: value, phase: 'rise' });
        }
        // Peak
        data.push({ x: 15, y: value + 15, phase: 'peak' });
        // Descending phase (Yellow)
        let fallValue = value + 15;
        for (let i = 16; i < 35; i++) {
            fallValue -= Math.random() * 4 + 1;
            data.push({ x: i, y: fallValue, phase: 'fall' });
        }
        return data;
    };

    const pointData = generateData();

    // Create gradient for the line
    const gradientLine = ctx.createLinearGradient(0, 0, 500, 0);
    gradientLine.addColorStop(0, '#00e5ff');   // Cyan start
    gradientLine.addColorStop(0.45, '#00e5ff'); // Cyan mid
    gradientLine.addColorStop(0.55, '#facc15'); // Yellow transition
    gradientLine.addColorStop(1, '#facc15');    // Yellow end

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Luminosity',
                data: pointData,
                borderColor: gradientLine,
                borderWidth: 2,
                pointBackgroundColor: (context) => {
                    const index = context.dataIndex;
                    return index < 15 ? '#00e5ff' : '#facc15';
                },
                pointBorderColor: 'transparent',
                pointRadius: 2,
                pointHoverRadius: 5,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(7, 17, 31, 0.9)',
                    titleColor: '#00e5ff',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(0, 255, 180, 0.3)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: { display: false }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: { display: false }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        },
        // Adding custom plugin to draw error bars to match the image accurately
        plugins: [{
            id: 'errorBars',
            afterDatasetsDraw: (chart) => {
                const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
                ctx.save();
                ctx.lineWidth = 1;
                
                chart.getDatasetMeta(0).data.forEach((point, index) => {
                    const phase = data.datasets[0].data[index].phase;
                    ctx.strokeStyle = phase === 'fall' || phase === 'peak' ? 'rgba(250, 204, 21, 0.6)' : 'rgba(0, 229, 255, 0.6)';
                    
                    const xPos = point.x;
                    const yPos = point.y;
                    const errorMargin = 8; // pixel height of error bar
                    
                    // Vertical line
                    ctx.beginPath();
                    ctx.moveTo(xPos, yPos - errorMargin);
                    ctx.lineTo(xPos, yPos + errorMargin);
                    ctx.stroke();
                    
                    // Top cap
                    ctx.beginPath();
                    ctx.moveTo(xPos - 2, yPos - errorMargin);
                    ctx.lineTo(xPos + 2, yPos - errorMargin);
                    ctx.stroke();

                    // Bottom cap
                    ctx.beginPath();
                    ctx.moveTo(xPos - 2, yPos + errorMargin);
                    ctx.lineTo(xPos + 2, yPos + errorMargin);
                    ctx.stroke();
                });
                ctx.restore();
            }
        }]
    });
});