import { _decorator, Component, Node, ScrollView, UITransform, Size, Vec3, Vec2,  } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ElasticView')
export class ElasticView extends Component {
    @property(Node)
    public startNode: Node = null!;
    @property(Node)
    public endNode: Node = null!;

    @property({ tooltip: 'Sensitivity of the stretch effect' })
    public stretchSensitivity: number = 0.005;

    updateScale(offset : Vec2, maxOffset: Vec2) {
        let startStretch = 0;
        let endStretch = 0;
        let stretchY = 0;

        if (offset.x > 0) {
            // Stretching left
            startStretch = offset.x * this.stretchSensitivity;
            endStretch = 0.0;
        }
        else if (Math.abs(offset.x) > maxOffset.x) {
            // Stretching right
            endStretch = (Math.abs(offset.x) - maxOffset.x) * this.stretchSensitivity;
            startStretch = 0.0;
        }
        else
        {
            startStretch = 0.0;
            endStretch = 0.0;
        }

        startStretch = Math.min(startStretch, 0.3);
        endStretch = Math.min(endStretch, 0.3);

        this.startNode.scale = new Vec3(1 + startStretch, 1 + stretchY * this.stretchSensitivity, 1);
        this.endNode.scale = new Vec3(1 + endStretch, 1 + stretchY * this.stretchSensitivity, 1);
    }
}
