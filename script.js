class Pokemon {
  constructor(name, attack) {
    this.name = name;
    this.attack = attack;
    this.health = 100;
    
  }

  calculateDamage() {
    return Math.floor(Math.random() * this.attack) + 1;
  }

  addAttackButtonListener() {
    const containerId = this.name.toLowerCase();
    const attackBtn = document.querySelector(`#${containerId} .attack-btn`);
    attackBtn.addEventListener('click', () => {
      if (containerId === 'pikachu') {
        this.attackEnemy(charizard);
      } else if (containerId === 'charizard') {
        this.attackEnemy(pikachu);
      }
    });
  }


  attackEnemy(enemy) {
    const damageToEnemy = this.calculateDamage();
    const damageToAttacker = enemy.calculateDamage();
    enemy.receiveDamage(damageToEnemy);
    this.receiveDamage(damageToAttacker);
    this.updateHealthDisplay();
    enemy.updateHealthDisplay();
    this.displayBattleLog(`${this.name} attacked ${enemy.name} and dealt ${damageToEnemy} damage!`);
    enemy.displayBattleLog(`${enemy.name} is attacked by ${this.name} and receives ${damageToEnemy} damage!`);
    this.checkBattleResult(enemy);
    enemy.checkBattleResult(this);
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


const pikachu = new Pokemon('Pikachu', 10);
const charizard = new Pokemon('Charizard', 8);

const pikachuImage = document.getElementById('pikachu-image');
const charizardImage = document.getElementById('charizard-image');

pikachuImage.addEventListener('click', () => {
  pikachu.attackEnemy(charizard);
});

charizardImage.addEventListener('click', () => {
  charizard.attackEnemy(pikachu);
});

fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
  .then(response => response.json())
  .then(data => {
    const spriteUrl = data.sprites.front_default;
    pikachuImage.src = spriteUrl;
  })
  .catch(error => {
    console.error('Error:', error);
  });

fetch('https://pokeapi.co/api/v2/pokemon/charizard')
  .then(response => response.json())
  .then(data => {
    const spriteUrl = data.sprites.front_default;
    charizardImage.src = spriteUrl;
  })
  .catch(error => {
    console.error('Error:', error);
  });

  
pikachu.addAttackButtonListener();
charizard.addAttackButtonListener();