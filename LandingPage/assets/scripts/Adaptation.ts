import { _decorator, Component, Node, view, UITransform, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Adaptation')
@_decorator.executeInEditMode
export class Adaptation extends Component {

    @property(UITransform)
    public _uiTransform: UITransform = null!;

    start() {
        this._uiTransform = this.node.getComponent(UITransform);
    }

    update(deltaTime: number) {
        if (this._uiTransform == null) return;
        const visibleSize = view.getVisibleSize();
        var scaleX = visibleSize.width / this._uiTransform.width;
        this._uiTransform.node.setScale(scaleX, scaleX);
    }
}


