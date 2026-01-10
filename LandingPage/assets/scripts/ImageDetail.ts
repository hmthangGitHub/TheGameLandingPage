import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ImageDetail')
export class ImageDetail extends Component {
    @property(Sprite)
    public sprite: Sprite | null = null;
}
