const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 25;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
const LOG_EVENT_BONUS_LIFE = "BONUS_LIFE";

const enterValue = prompt("Maximum life for you and the monster", "100");

let chosenMaxLife = parseInt(enterValue);
let battelLog = [];
let lastLoggedEntry;

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
  alert("You entered the wrong number, the maximum life is set to 100 ");
}
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealt = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, value, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
        logEntry.target = "MONSTER";
        break
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
        logEntry = {
            event: ev,
            value: value,
            target: "MONSTER",
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth,
          };
          break
    case LOG_EVENT_MONSTER_ATTACK:
        logEntry = {
            event: ev,
            value: value,
            target: "PLAYER",
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth,
          };
          break
    case LOG_EVENT_PLAYER_HEAL:
        logEntry = {
            event: ev,
            value: value,
            target: "PLAYER",
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth,
          };
          break
    case LOG_EVENT_GAME_OVER:
        logEntry = {
            event: ev,
            value: value,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth,
        };
        break
    case LOG_EVENT_BONUS_LIFE:
        logEntry = {
            event: ev,
            value: value,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        }
        break
    default:
        logEntry = {}
  }

//   if (ev === LOG_EVENT_PLAYER_ATTACK) {
//     logEntry.target = "MONSTER";
//   } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
//     logEntry = {
//       event: ev,
//       value: value,
//       target: "MONSTER",
//       finalMonsterHealth: monsterHealth,
//       finalPlayerHealth: playerHealth,
//     };
//   } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
//     logEntry = {
//       event: ev,
//       value: value,
//       target: "PLAYER",
//       finalMonsterHealth: monsterHealth,
//       finalPlayerHealth: playerHealth,
//     };
//   } else if (ev === LOG_EVENT_PLAYER_HEAL) {
//     logEntry = {
//       event: ev,
//       value: value,
//       target: "PLAYER",
//       finalMonsterHealth: monsterHealth,
//       finalPlayerHealth: playerHealth,
//     };
//   } else if (ev === LOG_EVENT_GAME_OVER) {
//     logEntry = {
//       event: ev,
//       value: value,
//       finalMonsterHealth: monsterHealth,
//       finalPlayerHealth: playerHealth,
//     };
//   }
  battelLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealt = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealt;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealt -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealt
  );
  if (currentPlayerHealt <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealt = initialPlayerHealth;
    alert("You would be dead but bonus life saved you!");
    setPlayerHealth(initialPlayerHealth);
    writeToLog(
      LOG_EVENT_BONUS_LIFE,
      'BONUS LIFE',
      currentMonsterHealth,
      currentPlayerHealt
    )
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealt > 0) {
    alert("You won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealt
    );
  } else if (currentPlayerHealt <= 0 && currentMonsterHealth > 0) {
    alert("You lost :(");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealt
    );
  } else if (currentPlayerHealt <= 0 && currentMonsterHealth <= 0) {
    alert("You killed each other");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DROW",
      currentMonsterHealth,
      currentPlayerHealt
    );
  }
  if (currentMonsterHealth <= 0 || currentPlayerHealt <= 0) {
    reset();
  }
}

function results(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const LogEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;
  //   if (mode === MODE_ATTACK) {
  //     maxDamage = ATTACK_VALUE;
  //     LogEvent = LOG_EVENT_PLAYER_ATTACK
  //   } else if (mode === MODE_STRONG_ATTACK) {
  //     maxDamage = STRONG_ATTACK_VALUE;
  //     LogEvent = LOG_EVENT_PLAYER_STRONG_ATTACK
  //   }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(LogEvent, damage, currentMonsterHealth, currentPlayerHealt);
  endRound();
}

function attackHandler() {
  results(MODE_ATTACK);
}

function strongAttackHandler() {
  results(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealt >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than your max initial health");
    healValue = chosenMaxLife - currentPlayerHealt;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealt += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealt
  );
  endRound();
}

function printLogHandler() {
  // for (let i = 0; i <3; i++) {
  //   console.log('-----------');
  // };

  // let j = 0;
  //  outerWhile: do {
  //   console.log('J-',j);
  //   inerFor: for (let k =0; k < 5; k++) {
  //     if (k === 3) {
  //       break outerWhile // przerwie zewętrzna po k === 3 ze wzgledu na przypisanie nazwy
  //     }
  //     console.log('K-',k);
  //   }
  //   j++
  //  } while (j<3);

  for ( let i = 0; i < battelLog.length; i++) {
    console.log(battelLog[i]);
  } //to samo co na dole

  // for ( const logEntry of battelLog) {
  //   console.log(logEntry);
  // };

  // let i = 0;
  // for (const logEntry of battelLog) {
  //   if (!lastLoggedEntry && lastLoggedEntry !== 0 || lastLoggedEntry < i) {
  //     console.log(`#${i}`);
  //     for (const key in logEntry) {
  //       console.log(`${key} => ${logEntry[key]}`);
  //     }
  //     lastLoggedEntry = i;
  //     break
  //   }
  //   i++
  // };
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
