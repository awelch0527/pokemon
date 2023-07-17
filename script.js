class Pokemon {
  constructor(name) {
    this.name = name;
    this.health = 100;
    this.spriteUrl = '';
    this.abilities = [];
    this.stats = []; // Added the stats property
    this.level = 50; // Set the level to the desired value

    this.fetchSprite();
    this.fetchAbilities();
  }

  fetchSprite() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${this.name.toLowerCase()}`)
      .then(response => response.json())
      .then(data => {
        this.spriteUrl = data.sprites.front_default;
        this.updateSprite();
        this.stats = data.stats; // Set the stats property
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  fetchAbilities() {
    fetch(`https://pokeapi.co/api/v2/pokemon/${this.name.toLowerCase()}`)
      .then(response => response.json())
      .then(data => {
        this.abilities = data.abilities.map(ability => {
          return {
            name: ability.ability.name,
            url: ability.ability.url
          };
        });

        this.createAttackButtons();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  updateSprite() {
    const containerId = this.name.toLowerCase();
    const imageElement = document.getElementById(`${containerId}-image`);
    imageElement.src = this.spriteUrl;
  }

  createAttackButtons() {
    const containerId = this.name.toLowerCase();
    const buttonContainer = document.querySelector(`#${containerId} .button-container`);

    this.abilities.forEach(ability => {
      const button = document.createElement('button');
      button.classList.add('attack-btn');
      button.textContent = ability.name;
      button.addEventListener('click', () => {
        this.attackEnemy(ability, this === pikachu ? charizard : pikachu);
      });

      buttonContainer.appendChild(button);
    });
  }

  attackEnemy(ability, enemy) {
    fetch(ability.url)
      .then(response => response.json())
      .then(data => {
        const moveDetails = data;

        // Find the power of the move
        const power = moveDetails.power || 0;

        // Find the attacker's attack stat
        const attackerStat = this.getStatValue('attack');

        // Find the defender's defense stat
        const defenderStat = enemy.getStatValue('defense');

        // Generate random attack powers
        const attackerDamage = Math.floor(Math.random() * 20 + 10); // Random value between 10 and 29
        const defenderDamage = Math.floor(Math.random() * 10 + 5); // Random value between 5 and 14

        enemy.receiveDamage(attackerDamage);
        this.receiveDamage(defenderDamage);
        this.updateHealthDisplay();
        enemy.updateHealthDisplay();
        this.displayBattleLog(`${this.name} used ${ability.name} and dealt ${attackerDamage} damage to ${enemy.name}!`);
        enemy.displayBattleLog(`${this.name} is attacked by ${enemy.name} and receives ${defenderDamage} damage!`);
        this.checkBattleResult(enemy);
        enemy.checkBattleResult(this);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  getStatValue(statName) {
    const stats = this.stats;
    const stat = stats.find(stat => stat.stat.name.toLowerCase() === statName.toLowerCase());
    return stat ? stat.base_stat : 0;
  }

  receiveDamage(damage) {
    this.health -= damage;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  displayBattleLog(message) {
    const battleLog = document.getElementById('battle-log');
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    battleLog.appendChild(logEntry);
    this.scrollBattleLog(); // Call the scrollBattleLog method from within the class
  }

  scrollBattleLog() {
    const battleLog = document.getElementById('battle-log');
    battleLog.scrollTop = battleLog.scrollHeight;
  }

  updateHealthDisplay() {
    const containerId = this.name.toLowerCase();
    const healthDisplay = document.querySelector(`#${containerId}-health`);
    healthDisplay.textContent = `Health: ${this.health}`;
  }

  checkBattleResult(enemy) {
    if (this.health <= 0 && enemy.health <= 0) {
      if (!alert.hasAlert) {
        alert.hasAlert = true;
        alert("It's a tie!");
        location.reload();
      }
    } else if (this.health <= 0) {
      if (!alert.hasAlert) {
        alert.hasAlert = true;
        alert(`${enemy.name} wins!`);
        location.reload();
      }
    } else if (enemy.health <= 0) {
      if (!alert.hasAlert) {
        alert.hasAlert = true;
        alert(`${this.name} wins!`);
        location.reload();
      }
    }
  }
}

const pikachu = new Pokemon('pikachu');
const charizard = new Pokemon('charizard');

const pikachuImage = document.getElementById('pikachu-image');
const charizardImage = document.getElementById('charizard-image');

pikachuImage.addEventListener('click', () => {
  pikachu.attackEnemy(pikachu.abilities[0], charizard);
});

charizardImage.addEventListener('click', () => {
  charizard.attackEnemy(charizard.abilities[0], pikachu);
});

// Preload the data before creating the instances
fetch(`https://pokeapi.co/api/v2/pokemon/pikachu`)
  .then(response => response.json())
  .then(data => {
    pikachu.preloadData(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

fetch(`https://pokeapi.co/api/v2/pokemon/charizard`)
  .then(response => response.json())
  .then(data => {
    charizard.preloadData(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
