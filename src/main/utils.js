export const updateUserInfo = (user) => {
  const myName = document.getElementById("myName");
  const myCoins = document.getElementById("myCoins");
  const myScore = document.getElementById("myScore");
  myName.innerText = user.username;
  myCoins.innerText = user.coins;
  myScore.innerText = user.maxscore;
};
