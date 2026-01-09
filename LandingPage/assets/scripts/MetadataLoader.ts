import { _decorator, Component, Node, assetManager, Label, SpriteFrame, instantiate, Sprite } from 'cc';
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

    @property(Node)
    public screenShotTemplate: Node = null!;

    @property(Sprite)
    public icon: Sprite = null!;

    async start() {
        let bundle = await this.loadBundle();

        await this.loadMetaData(bundle);

        this.loadingNode.active = false;
        this.container.active = true;
        this.screenShotTemplate.active = false;

        this.loadImages(bundle);
        this.loadIcon(bundle);
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
            let instance = instantiate(this.screenShotTemplate);
            instance.children[0].getComponent(Sprite).spriteFrame = spriteFrame;
            instance.active = true;
            instance.parent = this.screenShotTemplate.parent;
            console.log(`Loaded icon: ${spriteFrame.name}`);
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
            }
        });
    }
}


