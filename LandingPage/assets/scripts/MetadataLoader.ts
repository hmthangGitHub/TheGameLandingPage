import { _decorator, Component, Node, assetManager, Label, SpriteFrame, instantiate, Sprite, Button, PageView ,Animation} from 'cc';
import { ScreenShot } from "db://assets/scripts/ScreenShot";
import { ImageDetail } from './ImageDetail';
const { ccclass, property } = _decorator;

@ccclass('MetadataLoader')
export class MetadataLoader extends Component {
    @property(String)
    public project: string = '';

    @property(Node)
    public container: Node = null!;

    @property(Node)
    public loadingNode: Node = null!;

    @property(Label)
    public title: Label = null!;

    @property(Label)
    public developer: Label = null!;

    @property(Label)
    public about: Label = null!;

    @property(ScreenShot)
    public screenShotTemplate: ScreenShot = null!;

    @property(Sprite)
    public icon: Sprite = null!;

    @property(Button)
    public iconButton: Button = null!;

    @property(Animation)
    public spriteDetailAnimation: Animation = null!;

    @property(Button)
    public backBtn: Button = null!;

    @property(ImageDetail)
    public imageDetailTemplate: ImageDetail = null!;

    @property(PageView)
    public pageView: PageView = null!;

    async start() {
        this.loadingNode.active = true;
        this.container.active = false;
        this.screenShotTemplate.node.active = false;
        this.imageDetailTemplate.node.active = false;

        let bundle = await this.loadBundle();

        await this.loadMetaData(bundle);

        this.loadingNode.active = false;
        this.container.active = true;

        this.loadImages(bundle);
        this.loadIcon(bundle);

        this.backBtn.node.on('click', () => {
            this.spriteDetailAnimation.play("detailOff");
        });
    }

    private async loadImages(bundle) {
        const assets = await new Promise<SpriteFrame[]>((resolve, reject) => {
            bundle.loadDir('screenshots', SpriteFrame, (err, assets) => {
                if (err) {
                    console.error('Failed to load icons folder:', err);
                    reject(err);
                } else {
                    resolve(assets);
                }
            });
        });

        // 'assets' is an array containing all your SpriteFrames (1, 2, 3, 4)
        console.log(`Successfully loaded ${assets.length} icons!`);

        assets.forEach((spriteFrame, index) => {
            let instance = instantiate(this.screenShotTemplate.node).getComponent(ScreenShot);
            instance.sprite.spriteFrame = spriteFrame;
            instance.node.active = true;
            instance.node.parent = this.screenShotTemplate.node.parent;
            instance.button.node.on('click', () => {

                this.showImageDetail(assets, index);
            });
        });
    }

    private async loadMetaData(bundle) {
        const asset: any = await new Promise((resolve, reject) => {
            bundle.load('metadata', (err, asset) => {
                if (err) reject(err);
                else resolve(asset);
            });
        });
        const metadata = asset.json;
        this.title.string = metadata.title;
        this.developer.string = metadata.developer;
        this.about.string = metadata.about;
    }

    private async loadBundle() {
        const bundle = await new Promise<any>((resolve, reject) => {
            assetManager.loadBundle(this.project, (err, bundle) => {
                if (err) reject(err);
                else resolve(bundle);
            });
        });
        return bundle;
    }

    private loadIcon(bundle) {
        bundle.load('icon/spriteFrame', SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error('Failed to load icon:', err);
            } else {
                this.icon.spriteFrame = spriteFrame;
                this.iconButton.node.on('click', () => {
                    this.showImageDetail([spriteFrame], 0);
                });
            }
        });
    }

    private showImageDetail(spriteFrames: SpriteFrame[], index: number) {
        this.spriteDetailAnimation.play("detailShowing");
        this.pageView.removeAllPages();

        spriteFrames.forEach(spriteFrame => {
            const clone = instantiate(this.imageDetailTemplate.node).getComponent(ImageDetail);
            clone.node.parent = this.pageView.content;
            clone.node.active = true;
            clone.sprite.spriteFrame = spriteFrame;
            this.pageView.addPage(clone.node);
        });

        this.pageView.node.active = false;
        this.scheduleOnce(() => {
            this.pageView.node.active = true;
            this.scheduleOnce(() => {
                this.pageView.scrollToPage(index, 0);
            })
        });
    }
}


