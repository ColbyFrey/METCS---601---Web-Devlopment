let currentStage = 1;
let membersObj = [];
let currentPointSystem = '';
const pointSystems = {
    days: ['1', '2', '3', '4', '5', '6', '7', '8'],
    fib: ['1', '2', '4', '8', '16', '32'],
    tshirt: ['XS', 'S', 'M/S', 'M', 'L', 'XL', 'XXL']
};

document.addEventListener('DOMContentLoaded', () => {
    const stages = [
        document.getElementById('stage-game-setup'),
        document.getElementById('stage-story-entry'),
        document.getElementById('stage-voting'),
    ];

    function showStage(index) {
        stages.forEach((s, i) => {
            s.classList.toggle('hidden', i !== index);
            document.getElementById(`step-${i + 1}`).classList.toggle('active-step', i === index);
        });

        // Always show story once it's entered

        // Show member board only during voting or reveal
        const isVotingOrReveal = index === 2 || index === 3;
        document.getElementById('member-board-container').classList.toggle('hidden', !isVotingOrReveal);

        currentStage = index + 1;
    }

    document.getElementById('gameSetupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const gameName = document.getElementById('gameName').value;
        const unit = document.getElementById('unit').value;
        const playerCount = parseInt(document.getElementById('teamSize').value);
        currentPointSystem = unit;

        document.getElementById('currentGameName').textContent = gameName;
        document.getElementById('currentPointSystem').textContent = unit;

        membersObj = [];

        localStorage.setItem('playerCount', playerCount);
        localStorage.setItem('pointSystem', unit);

        for (let i = 0; i < playerCount; i++) {
            const user = {
                id: i + 1,
                firstName: `User`,
                lastName: `${i + 1}`,
                vote: null,
            };

            const nameEntryBoard = document.getElementById('nameEntryBoard');

            nameEntryBoard.innerHTML += `
                    <div class="member-card">
                    <div class="avatar-circle">#${user.id}</div>
                    <div class="flexbox-container">
                        <label>First Name: <input type="text" data-id="${user.id}" data-type="first" placeholder="User" /></label>
                        <label>Last Name: <input type="text" data-id="${user.id}" data-type="last" placeholder="${user.id}" /></label>
                    </div>
                    </div>
                `;

            membersObj.push(user);
        }

        showStage(1);
    });


    document.getElementById('createStoryBtn').addEventListener('click', () => {
        const storyText = document.getElementById('storyArea').value.trim();
        const bar = document.getElementById('member-bar');
        const unit = localStorage.getItem('pointSystem') || 'days';

        if (!storyText) return alert('Please enter a story.');
        document.getElementById('displayedStory').textContent = storyText;
        let playerCount = parseInt(localStorage.getItem('playerCount') || 1);

        membersObj.forEach(member => {
            const firstInput = document.querySelector(`input[data-id="${member.id}"][data-type="first"]`);
            const lastInput = document.querySelector(`input[data-id="${member.id}"][data-type="last"]`);
            member.firstName = firstInput?.value.trim() || `User`;
            member.lastName = lastInput?.value.trim() || `${member.id}`;
        });


        for (let i = 0; i < playerCount; i++) {
            const user = membersObj[i] || {
                id: i + 1,
                firstName: `User`,
                lastName: `${i + 1}`,
                vote: null,
            };
            const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
            const optionsHtml = pointSystems[unit].map(p => `<option value="${p}">${p}</option>`).join('');

            bar.innerHTML += `
            <div data-member="${user.id}" class="member-card" id="member-card-${user.id}">
                <button class="remove-member-btn" data-member="${user.id}">&times;</button>
                <div class="avatar-circle" id="avatar-${user.id}">${initials}</div>
                <div class="flexbox-container">
                <span class="member-name">${user.firstName} ${user.lastName}</span>
                <span class="vote-status" id="vote-status-${user.id}">Not Voted</span>
                <select id="select-vote-${user.id}" class="vote-dropdown" data-member="${user.id}">
                    <option disabled selected>Cast your vote</option>
                    ${optionsHtml}
                </select>
                <button id="change-vote-${user.id}" data-member="${user.id}" class="change-vote-btn hidden">Change Vote</button>
                </div>
            </div>
            `;



            membersObj.push(user);
        }
        setTimeout(() => {
            document.querySelectorAll('.vote-dropdown').forEach(select => {
                select.addEventListener('change', (e) => {
                    const memberId = parseInt(e.target.dataset.member);
                    const vote = e.target.value;
                    const member = membersObj.find(m => m.id === memberId);
                    member.vote = vote;
                    document.getElementById(`vote-status-${memberId}`).textContent = `Vote Cast`;
                    // Hide the dropdown to prevent revealing vote value
                    e.target.classList.add('hidden');

                    document.getElementById(`change-vote-${memberId}`).classList.remove('hidden');
                });
            });
            document.querySelectorAll('.change-vote-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const memberId = parseInt(e.target.dataset.member);

                    // Hide the dropdown to prevent revealing vote value
                    e.target.classList.add('hidden');

                    document.getElementById(`select-vote-${memberId}`).classList.remove('hidden');
                });
            });

            document.querySelectorAll('.remove-member-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const memberId = parseInt(e.target.dataset.member);

                    // Remove from DOM
                    const card = document.getElementById(`member-card-${memberId}`);
                    if (card) card.remove();

                    // Remove from array
                    membersObj = membersObj.filter(m => m.id !== memberId);
                });
            });


        }, 0);

        showStage(2);
    });

    // Reveal Votes
    document.getElementById('revealVotesBtn').addEventListener('click', () => {
        membersObj.forEach(member => {
            if(!member.vote) {
                alert(`${member.firstName} ${member.lastName} has not voted yet.`);
                return;
            }
        });
        const votes = membersObj.map(u => u.vote);
        let resultText = '';

        if (currentPointSystem === 'days' || currentPointSystem === 'fib') {
            const avg = votes.map(Number).reduce((a, b) => a + b, 0) / votes.length;
            resultText = `Average Vote: ${avg.toFixed(2)}`;
        } else {
            const counts = {};
            votes.forEach(v => counts[v] = (counts[v] || 0) + 1);
            const mode = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
            resultText = `Most Common Vote: ${mode}`;
        }

        document.getElementById('resultDisplay').textContent = resultText;
        // Reveal each user's vote next to their name
        membersObj.forEach(user => {
            const statusEl = document.getElementById(`vote-status-${user.id}`);
            statusEl.textContent = `Voted: ${user.vote}`;
        });

    });
});

