const tripState = {
    weather: "",
    budget: "",
    mood: "",
    destination: ""
};

const apiKey = process.env.GEMINI_API_KEY;

window.onload = function() {
    home();
};

function isReady() {
    return Boolean(tripState.weather && tripState.budget && tripState.mood && tripState.destination);
}

function home() {
    const ready = isReady();

    document.getElementById("content").innerHTML = `
        <div class="hero">
            <div class="hero-overlay">
                <h2>Plan Your Perfect Escape</h2>
                <p>Customize your weather, budget, vibe, and destination to unlock a custom AI itinerary.</p>
                
                <div class="selection-status">
                    <span class="badge ${tripState.weather ? 'active' : ''}">
                        ${tripState.weather ? '🌦️ ' + tripState.weather : '🌦️ Weather'}
                    </span>
                    <span class="badge ${tripState.budget ? 'active' : ''}">
                        ${tripState.budget ? '💰 ₹' + tripState.budget : '💰 Budget'}
                    </span>
                    <span class="badge ${tripState.mood ? 'active' : ''}">
                        ${tripState.mood ? '🎭 ' + tripState.mood : '🎭 Mood'}
                    </span>
                    <span class="badge ${tripState.destination ? 'active' : ''}">
                        ${tripState.destination ? '📍 ' + tripState.destination : '📍 Destination'}
                    </span>
                </div>

                <button id="start" onclick="startPlanning()" ${ready ? "" : "disabled"}>
                    ${ready ? "Generate Travel Itinerary 🚀" : "Complete All Options"}
                </button>
            </div>
        </div>

        <div class="gallery-section">
            <h3>Featured Travel Destinations</h3>
            <div class="image-grid">
                <div class="card">
                    <img src="https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80" alt="Waterfalls">
                    <span>Cascading Waterfalls</span>
                </div>
                <div class="card">
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" alt="Tropical Beach">
                    <span>Tropical Beaches</span>
                </div>
                <div class="card">
                    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" alt="Mountains">
                    <span>Alpine Mountains</span>
                </div>
                <div class="card">
                    <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80" alt="Misty Forest">
                    <span>Misty Forests</span>
                </div>
            </div>
        </div>
    `;
}

function weather() {
    document.getElementById("content").innerHTML = `
        <div class="form-card">
            <h2>🌦️ Select Season</h2>
            <select id="weatherSelect" onchange="weatherSelected(this.value)">
                <option value="">Choose Season</option>
                <option value="Summer" ${tripState.weather === 'Summer' ? 'selected' : ''}>Summer</option>
                <option value="Winter" ${tripState.weather === 'Winter' ? 'selected' : ''}>Winter</option>
                <option value="Monsoon" ${tripState.weather === 'Monsoon' ? 'selected' : ''}>Monsoon</option>
                <option value="Spring" ${tripState.weather === 'Spring' ? 'selected' : ''}>Spring</option>
            </select>
        </div>
    `;
}

function weatherSelected(value) {
    if (value !== "") {
        tripState.weather = value;
    }
    home();
}

function budget() {
    document.getElementById("content").innerHTML = `
        <div class="form-card">
            <h2>💰 Enter Budget</h2>
            <input type="number" id="money" placeholder="Enter budget in ₹" value="${tripState.budget}">
            <button onclick="budgetSelected()">Save Budget</button>
        </div>
    `;
}

function budgetSelected() {
    let val = document.getElementById("money").value;
    if (val !== "" && val > 0) {
        tripState.budget = val;
    }
    home();
}

function mood() {
    document.getElementById("content").innerHTML = `
        <div class="form-card">
            <h2>🎭 Select Travel Vibe</h2>
            <select onchange="moodSelected(this.value)">
                <option value="">Choose Mood</option>
                <option value="Adventure" ${tripState.mood === 'Adventure' ? 'selected' : ''}>Adventure</option>
                <option value="Relaxing" ${tripState.mood === 'Relaxing' ? 'selected' : ''}>Relaxing</option>
                <option value="Romantic" ${tripState.mood === 'Romantic' ? 'selected' : ''}>Romantic</option>
                <option value="Cultural" ${tripState.mood === 'Cultural' ? 'selected' : ''}>Cultural</option>
            </select>
        </div>
    `;
}

function moodSelected(value) {
    if (value !== "") {
        tripState.mood = value;
    }
    home();
}

function destination() {
    document.getElementById("content").innerHTML = `
        <div class="form-card">
            <h2>📍 Target Destination</h2>
            <input type="text" id="destinationInput" placeholder="e.g. Kyoto, Paris, Goa, Manali" value="${tripState.destination}">
            <button onclick="destinationSelected()">Save Destination</button>
        </div>
    `;
}

function destinationSelected() {
    let val = document.getElementById("destinationInput").value.trim();
    if (val !== "") {
        tripState.destination = val;
    }
    home();
}

async function startPlanning() {
    if (!isReady()) return;

    document.getElementById("content").innerHTML = `
        <div class="form-card" style="max-width: 500px;">
            <h2>✨ Building Your Travel Plan...</h2>
            <p style="color: #94a3b8; margin-top: 10px;">Creating a ${tripState.mood.toLowerCase()} experience for ${tripState.destination} in ${tripState.weather}.</p>
        </div>
    `;

    const prompt = `Create a 3-day travel itinerary for a trip to ${tripState.destination} during the ${tripState.weather} season. 
The total budget is ₹${tripState.budget} and the overall mood/vibe of the trip should be ${tripState.mood}. 
Format the response clearly using simple headings for Day 1, Day 2, Day 3, along with budget tips and top local foods to try.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || "API Request Failed");
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiPlan = data.candidates[0].content.parts[0].text;
            
            const formattedPlan = aiPlan
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            document.getElementById("content").innerHTML = `
                <div class="form-card" style="max-width: 700px; text-align: left;">
                    <h2 style="text-align: center;">🌴 ${tripState.destination} Itinerary</h2>
                    <div style="margin: 15px 0; color: #94a3b8; font-size: 0.9rem; text-align: center;">
                        <strong>Season:</strong> ${tripState.weather} | 
                        <strong>Budget:</strong> ₹${tripState.budget} | 
                        <strong>Vibe:</strong> ${tripState.mood}
                    </div>
                    <hr style="border-color: #1e293b; margin-bottom: 20px;">
                    <div style="line-height: 1.7; color: #f8fafc; font-size: 0.95rem;">${formattedPlan}</div>
                    <div style="text-align: center; margin-top: 25px;">
                        <button onclick="home()" style="width: auto; padding: 10px 25px;">
                            Plan Another Trip
                        </button>
                    </div>
                </div>
            `;
        } else {
            throw new Error("Invalid response from API");
        }

    } catch (error) {
        console.error("Gemini API Error details:", error);
        document.getElementById("content").innerHTML = `
            <div class="form-card">
                <h2>⚠️ Error Generating Plan</h2>
                <p style="color: #94a3b8; margin-top: 10px;"><strong>Reason:</strong> ${error.message}</p>
                <button onclick="home()" style="margin-top: 20px;">Try Again</button>
            </div>
        `;
    }
}
