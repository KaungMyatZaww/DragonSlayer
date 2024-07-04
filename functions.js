/* declare js variables ! */
let xp = 0;
let gold = 70;
let health = 100;
let currentWeapon = 0;
let inventory = ["stick"];
let fighting;
let monsterHealth;

/* Link with html elements */
const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const text = document.querySelector('#text');
const xpText = document.querySelector('#xpText');
const healthText = document.querySelector('#healthText');
const goldText = document.querySelector('#goldText');
const monsterStats = document.querySelector('#monsterStats');
const monsterName = document.querySelector('#monsterName');
const monsterHelthText = document.querySelector('#monsterHealth');

//Locations aka direcotory of the game
const locations = [
    {
        name:  "town square",
        "button text":["Go to Store", "Go to Cave", "Fight Dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in townsquare. You see a sign that says \"Store\". "
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (50gold)", "Go to town square"],
        "button functions":[buyHealth, buyWeapon, goTown],
        text: "You enter the store"
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "button functions": [fightSLime, fightBeast, goTown],
        text: "You enter the cave and found a terrifying beast waiting. It's a \"Slime\"."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster. NOTE - Monster and you will attack at the SAME TIME!!!"
    },
    {
        name: "Monster Defeated",
        "button text": ["Go to townsquare", "Go to townsquare", "Go to townsquare"],
        "button functions": [goTown, easterEgg, goTown],
        text: "You defeated the monster and gained experience and gold. YAYYYY!!!"
    },
    {
        name: "lose",
        "button text": ["Restart?", "Restart?", "Restart?"],
        "button functions": [restart, restart, restart],
        text: "You died. &#x2620;"
    },
    {
        name: "win",
        "button text": ["Restart?", "Restart?", "Restart?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;"
    },
    {
        name: "easter egg",
        "button text": ["Choose 2", "Choose 8", "goTown"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
];

//Create the weapons
const weapons = [
    {name: "stick", power: 5},
    {name: "blood dagger", power: 30},
    {name: "war hammer", power: 50},
    {name: "blade of chaos", power: 100}
];

//crete Monsters
const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15,
    },
    {
        name: "fanged beast",
        level: 6,
        health: 60,
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];

//Initialize function buttons
button1.onclick = goStore; 
button2.onclick = goCave;
button3.onclick = fightDragon;


//update function for easier location access
function update(location){
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0]; 
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
}

function goTown(){
    update(locations[0]);
}

function goStore(){
    update(locations[1]);
}

function goCave(){
    update(locations[2]);
}


// function in store tab
function buyHealth(){
    if (gold >= 10){
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    }else{
        text.innerText = "You don't have enought gold!!"
    }
}

function buyWeapon(){
    if(currentWeapon < weapons.length-1){
        if (gold >= 50){
            gold -= 50;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You have purchased "+ newWeapon+".";
            inventory.push(newWeapon);
            text.innerText += " You now have: "+ inventory+".";
        }else{
            text.innerText = "You don't have enough gold!!!";
        }
    }else{
        text.innerText = "You have the strongest weapon of all.";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }    
}

function sellWeapon(){
    if (inventory.length > 1){
        gold += 15;
        goldText.innerText = gold;
        currentWeapon = inventory.shift();
        text.innerText = "You sold a "+currentWeapon+".";
        text.innerText += " You now have: "+inventory+".";
    }else{
        text.innerText = "Don't sell your only weapon. You only have: "+ inventory+ ".";
    }
}
//Starts fighting 
function fightSLime(){
    fighting = 0;
    goFight();
}

function fightBeast(){
    fighting = 1;
    goFight();
}
function fightDragon(){
    fighting = 2;
    goFight();
}
//fighting 
function goFight(){
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterHelthText.innerText = monsterHealth;
    monsterName.innerText = monsters[fighting].name;
}

function attack(){
    text.innerText = "The "+monsters[fighting].name +" attacks.";
    text.innerText += " You attack the "+monsters[fighting].name+ " with your " + inventory[currentWeapon]+".";
    health -= getMonsterDamage(monsters[fighting].level);
    if (isMonsterHit()){
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    }else{
        text.innerText += " And you \"missed\".";
    }
    healthText.innerText = health;
    monsterHelthText.innerText = monsterHealth;
    if(health <= 0){
        lose();
    }else if (monsterHealth <= 0){
        if (fighting == 2){
            winGame();
        }else{
            MonsterDefeated();
        }
    }
    if (Math.random() <= .1 && inventory.length !== 1){
        text.innerText += " Oops!! Your "+ inventory.pop() + " broke!";
        currentWeapon--;
    }
}
//calculate the damage of monster with levels
function getMonsterDamage(level){
    const damage = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(damage);
    return damage > 0 ? damage : 0;
}

//miss chance calculation
function isMonsterHit(){
    return Math.random() > .2 || health < 20;
}
function dodge(){
    text.innerText = "You dodged the attack from "+ monsters[fighting].name+ ".";
}

//Defeating monster excpet final boss
function MonsterDefeated(){
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

//Defeating final boss win condition
function winGame(){
    update(locations[6])
}

//loss condition
function lose(){
    update(locations[5])
}

function restart(){
    xp = 0;
    gold = 50;
    health = 100;
    currentWeapon = 0;
    inventory = ["stick"];
    goldText.innerText = xp;
    goTown();
}

function easterEgg(){
    update(locations[7]);
}

function pickTwo(){
    guess(2);
}
function pickEight(){
    guess(8);
}
function guess(pick){
    const number = [];
    while (number.length < 10){
        number.push(Math.floor(Math.random()*11));
    }
    text.innerText = "You picked " +pick+ ". Here are the random numbers";
    for (let i=0; i< 10; i++){
        text.innerText += number[i] + "\n";
    }

    if(number.includes(pick)){
        text.innerText += "And you WIN!!! and got 20 gold."
        gold += 20;
        goldText.innerText = gold;
    }else{
        text.innerText += "Awwwn!!! You didn't pick the jackpot. You lost 10 health";
        health -= 15;
        healthText.innerText = health;
        if (health <= 0){
            lose();
        }
    }
}
