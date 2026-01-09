import { _decorator, Component, Node, ScrollView, UITransform, Size, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ElasticScrollView')
export class ElasticScrollView extends Component {
    @property(ScrollView)
    public scrollView: ScrollView = null!;

    @property(Node)
    public startNode: Node = null!;
    @property(Node)
    public endNode: Node = null!;

    @property({ tooltip: 'Sensitivity of the stretch effect' })
    public stretchSensitivity: number = 0.005;

    private _defaultContentSize: Size = new Size();
    private _defaultChildSize: Size = new Size(); // Stores the size of the first child
    private _contentUiTrans: UITransform | null = null;
    private _viewUiTrans: UITransform | null = null;

    start() {
        if (!this.scrollView) {
            this.scrollView = this.node.getComponent(ScrollView)!;
        }

        if (this.scrollView && this.scrollView.content) {
            this._contentUiTrans = this.scrollView.content.getComponent(UITransform);
            if (this._contentUiTrans) {
                this._defaultContentSize.set(this._contentUiTrans.contentSize);
            }

            // Capture the default size of the first child
            if (this.scrollView.content.children.length > 0) {
                const firstChild = this.scrollView.content.children[0];
                const childUi = firstChild.getComponent(UITransform);
                if (childUi) {
                    this._defaultChildSize.set(childUi.contentSize);
                }
            }

            // Usually the parent of content is the view (mask)
            if (this.scrollView.content.parent) {
                this._viewUiTrans = this.scrollView.content.parent.getComponent(UITransform);
            }
        }
    }

    update(dt: number) {
        if (!this.scrollView || !this._contentUiTrans || !this._viewUiTrans) return;

        const offset = this.scrollView.getScrollOffset();
        const maxOffset = this.scrollView.getMaxScrollOffset();

        // Calculate max offset based on DEFAULT content size to avoid feedback loops 
        const viewSize = this._viewUiTrans.contentSize;
        const maxOffsetX = Math.max(0, this._defaultContentSize.width - viewSize.width);
        const maxOffsetY = Math.max(0, this._defaultContentSize.height - viewSize.height);

        let startStretch = 0;
        let endStretch = 0;
        let stretchY = 0;

        // Calculate stretch for Horizontal
        if (this.scrollView.horizontal) {
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
            
        }

        // Calculate stretch for Vertical
        if (this.scrollView.vertical) {
            if (offset.y < 0) {
                // Stretching top
                stretchY = -offset.y;
            } else if (offset.y > maxOffsetY) {
                // Stretching bottom
                stretchY = offset.y - maxOffsetY;
            }
        }

        this.startNode.scale = new Vec3(1 + startStretch, 1 + stretchY * this.stretchSensitivity, 1);
        this.endNode.scale = new Vec3(1 + endStretch, 1 + stretchY * this.stretchSensitivity, 1);
    }
}
