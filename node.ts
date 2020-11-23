import {DeepReadonly, h, readonly, VNode} from "vue";
import { renderNucleusBody } from ".";
import {ClassBag, Modifier, ModifierHandlerContext} from "./modifier";

export type NucleusRenderable = VNode | VNode[];
export type VNodeArgs = Parameters<typeof h>;
export type VNodeType = VNodeArgs[0];
export type VNodeProps = NonNullable<VNodeArgs[1]>;
export type VNodeChildren = VNodeArgs[2];
export type SingleOrArrayOrFunction<T> =
    T | T[] | T[][]
    | (() => T) | (() => T[]);
export type NucleusNodes = SingleOrArrayOrFunction<NucleusNode>;
export type NucleusBody = SingleOrArrayOrFunction<NucleusNode|Modifier|null>;

export interface RenderableNode {
    toVNodes(): VNode[];
}

function instanceOfRenderableNode(object: any): object is RenderableNode {
    return 'toVNodes' in object;
}

export function singleOrArrayOrFunctionToArray<T>(value: SingleOrArrayOrFunction<T>): T[] {
    if (typeof value === "function") {
        value = (value as (() => T[]) | (() => T))();
    }

    if (!Array.isArray(value)) {
        value = [value];
    }

    return value.flat() as T[];
}

export function nucleusBodyToNodes(body: NucleusNodes): RenderableNode[] {
    return singleOrArrayOrFunctionToArray(body);
}

export class NucleusNode implements RenderableNode {
    protected modifiers: Modifier[] = [];
    protected props: VNodeProps = {style: {}};
    protected context = "";
    protected classBag = new ClassBag();

    constructor(
        protected tag: keyof HTMLElementTagNameMap = "div",
        protected _body: NucleusBody = [],
    ) { }

    getBody() {
        return this._body;
    }

    protected getNodeModifiers(): Modifier[] {
        return [];
    }

    public getModifiers(): ReadonlyArray<Modifier> {
        let res = [...this.getNodeModifiers(), ...this.modifiers];
        for (const item of singleOrArrayOrFunctionToArray(this._body)) {
            if (item instanceof Modifier) {
                res.push(item);
            }
        }

        res = res.reverse().sort((a, b) => {
            return a.getPriority() > b.getPriority() ? 1 : -1;
        }).filter((modifier, index, self) => {
            if (!modifier.needToBeUnique()) {
                return true;
            }
            const firstModifierLikeIt = self.find(m => modifier.getUniqueIdentifier() === m.getUniqueIdentifier());
            if (firstModifierLikeIt === undefined) {
                return true;
            }
            return self.indexOf(firstModifierLikeIt) === index;
        });

        return res;
    }

    protected beforeApplyingModifiers(): void {
        // to be overloaded
    }

    private applyModifiers() {
        this.beforeApplyingModifiers();
        for (const modifier of this.getModifiers()) {
            const context: ModifierHandlerContext = {
                parent: this,
                props: this.props,
                classBag: this.classBag,
            };
            modifier.handle(context);
        }

        if (this.classBag.isNotEmpty()) {
            this.props.class = this.classBag.getClasses();
        }
    }

    getChildrenVNodes(): VNode[]|string {
        const nodes = [];

        for (const item of singleOrArrayOrFunctionToArray(this._body)) {
            if (item instanceof NucleusNode) {
                this.modifyChild(item);
                nodes.push(item);
            }
        }

        return renderNucleusBody(nodes);
    }

    getProps(): DeepReadonly<VNodeProps> {
        return readonly(this.props);
    }

    render(): NucleusRenderable {
        this.applyModifiers();
        return h(this.tag, this.getProps() as VNodeProps, this.getChildrenVNodes());
    }

    toVNodes(): VNode[] {
        const render = this.render();
        return (Array.isArray(render) ? render : [render]).map(VNode => {
            return VNode;
        })
    }

    public modifyChild(child: NucleusNode): void {
        // to be overloaded
    }

    apply(modifier: Modifier|Modifier[]): this {
        this.modifiers.push(...Array.isArray(modifier) ? modifier : [modifier]);
        return this;
    }

    body(body: NucleusBody): this {
        this._body = body;
        return this;
    }

    setContext(context: string): this {
        this.context = context;
        return this;
    }

    getContext(): string {
        return this.context;
    }

    isContext(context: string): boolean {
        return this.getContext() === context;
    }

    when<T extends any>(condition: T, callback: (node: this, value: T) => void, fallback: (node: this, value: T) => void = () => {/*nothing*/}) {
        if (condition) {
            callback(this, condition);
        } else {
            fallback(this, condition);
        }
        return this;
    }

    surround<T extends NucleusNode>(outter: (child: this) => T): T;
    surround<T extends NucleusNode>(outter: T): T;
    surround<T extends NucleusNode>(outter: T|((child: this) => T)): T {
        if (typeof outter === "function") {
            return outter(this);
        }
        return outter.body(this);
    }
}

export class TransitiveNucleusNode implements RenderableNode {
    public vnode: VNode;

    constructor(vnode: VNode) {
        this.vnode = vnode;
    }

    toVNodes(): VNode[] {
        return [this.vnode];
    }

}

export function extractNodeFromBody(body: NucleusBody, predicate: (n: NucleusNode) => boolean, extractedNode: (n: NucleusNode) => void): NucleusBody {
    const nodes = singleOrArrayOrFunctionToArray(body);
    const extracted = (nodes.filter(n => n instanceof NucleusNode) as NucleusNode[]).find(value => predicate(value));
    if (extracted === undefined) {
        return body;
    }

    extractedNode(extracted);

    const newNodes = nodes.filter(value => value !== extracted);
    return typeof body === "function" ? (() => newNodes) : newNodes;
}

export default NucleusNode;

export class EmptyNode extends NucleusNode {
    toVNodes(): VNode[] {
        return [];
    }
}
