class Block {
    constructor(location, blockSize){
        this.blockSize = blockSize;
        this.location = location; //*relative location with previous block 
        this.posX;
        this.posY;
        this.coin = Math.random()>0.8; //*if the block has coin or not
        this.img = Math.random()>0.7;
    }
}
export { Block };