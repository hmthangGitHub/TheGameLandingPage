import { _decorator, Component, Node, PageView } from 'cc';
import {ElasticView} from "./ElasticView";
const { ccclass, property } = _decorator;

@ccclass('ElasticPageView')
export class ElasticPageView extends Component {
    @property(PageView)
    public pageView: PageView = null!;

    @property(ElasticView)
    public elasticView: ElasticView = null!;

    update(dt)
    {
        this.elasticView.updateScale(this.pageView.getScrollOffset(), this.pageView.getMaxScrollOffset());
    }
}


