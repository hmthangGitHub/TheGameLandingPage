import { _decorator, Component, Node, Sprite, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScreenShot')
export class ScreenShot extends Component {
    @property({ type: Sprite })
    public sprite: Sprite = null;

    @property({ type: Button })
    public button: Button = null;
}


