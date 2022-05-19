# **ID311 PROJECT1**

KAIST 20200529 Hyewon Lee

hyewon0809@kaist.ac.kr

http://git.prototyping.id/20200529/ID311_PROJECT1.git


<br>

# **Run Through Gravity**
https://runthroughgravity.web.app

>One day the invasion began from the unknown.
>
>While running away, you found the only escape stairway.
>
>Escape as fast as you can.
>But becareful, you can go down the stairs.
>![concept](etc/Readme1.png)
>**Tip!** If you face a stair that goes up, change the direction of gravity
>


## **How to play?**
You will use only three keys during the game. The space bar is used to go down the stairs, and the arrow is used to change the direction of gravity.
- `Space bar`
    : go down the 1 stair block
- `Upward arrow`
    : change the gravity direction to upward
- `Downward arrow`
    : change the gravity direction to downward

If you try to go up the stairs, you will fall to the floor. If you face the stairs going up, **change the direction of gravity and go down**.

1. You should catch up the gravity direction by reading the map drawing
2. If the relative position of next stair step is same with gravity direction, just go down the stair by pressing spacebar once.
![concept](etc/Readme2.png)
3. If the relative position of next stair step is different from graviy direction, in other words, if it is trying to go up the stair, then change the gravity direction to opposite.
![concept](etc/Readme3.png)
    - If the current direction is downward, make upward by pressing upward-arrow key
    - If the current direction is upward, make downward by pressing downward-arrow key
4. After change gravity direction, then go down the stairs.


## **How to get points?**
The game will count **how many steps of stairs did you go down**. It will be applied to you final score.
Your life will be decreased linearly dependent on time. So **move fast as much as you can.** If you make the correct move, your life will be increased.
If you make the wrong move or the life goes zero, then the game will end.
![concept](etc/Readme5.png)

## **How to check my rank?**
If you move to mypage, you can check your current coins and max score that you made on the leftside.
Your global rank will be shown on the rightside.
![concept](etc/Readme4.png)

***


## **Implementation**
The functions implemented corely in this project are as follows.
- Producing Dynamic Random Map
    1. Implement object factory for produce random block
    2. Implement observing for detect various events(move, fall, die, coin, etc.)
    - construct 6 objects with below realtion, arrow indicates observing direction 
    ![sketch](etc/Readme8.png)
    - map object mainly operates the game, 
        1. detect user's move
        2. check the correction
        3. notify the move to observer and make animation
    3. Use async, await keyword for file loading(sound, gif, etc.) before game start
    4. Use gif animation and sound for dynamic game play
    
- Managing Users
    1. Implement managing system using firebase
        - construct user object database with below structure
        ![sketch](etc/Readme6.png)
        - prevent duplicated users by checking conditions during signup (user cannot register username and email that already taken)
    2. Add new user object when signup and get user information from user object database when signin
    3. Update user information for every game play using local storage and update ranking using user database.
    
- Page Move
    1. Consturct multilevel page structure and manage them by classname
    ![sketch](etc/Readme7.png)
    2. Change the html element classname for every event(page move)


<br>

### **Libraries**
Project was start with **[vite project](https://vitejs.dev/guide/#trying-vite-online)** template. 

All features were implemented based on **[p5.js](https://p5js.org)**. 

