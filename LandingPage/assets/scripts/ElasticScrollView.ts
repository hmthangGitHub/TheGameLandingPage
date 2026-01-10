import { _decorator, Component, Node, ScrollView, UITransform, Size, Vec3, PageView } from 'cc';
import {ElasticView} from "./ElasticView";
const { ccclass, property } = _decorator;

@ccclass('ElasticScrollView')
export class ElasticScrollView extends Component {
    @property(ScrollView)
    public scrollView: ScrollView = null!;

    @property(ElasticView)
    public elasticView: ElasticView = null!;

    update(dt)
    {
        this.elasticView.updateScale(this.scrollView.getScrollOffset(), this.scrollView.getMaxScrollOffset());
    }
}
