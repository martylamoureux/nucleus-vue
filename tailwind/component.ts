import NucleusNode, {EmptyNode, extractNodeFromBody, NucleusBody, singleOrArrayOrFunctionToArray} from "../node";
import NucleusFragment, {createFragment, FragmentComponent, Grow, isFragment} from "./fragment";
import TailwindNode from "./tailwind-node";

export interface ComponentGetterPayload {
    body: NucleusBody;
    fragment: FragmentGetter;
}

export type NucleusFragementTransformer = (f: NucleusFragment) => NucleusNode;
export type ComponentGetter<T extends TailwindNode = TailwindNode> = (payload: ComponentGetterPayload) => T;
export type FragmentGetter = (name: string) => NucleusNode|EmptyNode;

export class ComponentBuilder<T extends TailwindNode = TailwindNode>  {
    protected fragments: {[key: string]: NucleusNode} = {};

    constructor(
        protected body: NucleusBody = [],
    ) {}

    render(component: ComponentGetter<T>) {
        const fragment: FragmentGetter = name => {
            if (name in this.fragments) {
                return this.fragments[name];
            }
            return new EmptyNode();
        };
        return component({ body: this.body, fragment });
    }

    fragment(fragment: FragmentComponent, transform: NucleusFragementTransformer): this;
    fragment(name: string, transform: NucleusFragementTransformer): this;
    fragment(fragment: FragmentComponent|string, transform: NucleusFragementTransformer = (f) => f): this {
        let res: NucleusNode = new EmptyNode();
        const name: string = typeof fragment === "string" ? fragment : fragment([]).fragmentName;

        this.body = extractNodeFromBody(this.body, isFragment(name), n => {
            res = transform((n as NucleusFragment).handle());
        });

        this.fragments[name] = res;

        return this;
    }

    transform(predicate: (n: TailwindNode) => boolean, transform: (n: TailwindNode) => TailwindNode) {
        this.body = singleOrArrayOrFunctionToArray(this.body).map(item => {
            if (item instanceof TailwindNode && predicate(item)) {
                return transform(item as TailwindNode);
            }
            return item;
        });

        return this;
    }

    transformContext(context: string, transform: (n: TailwindNode) => TailwindNode) {
        return this.transform(n => n.isContext(context), transform);
    }

    transformFragment(fragment: FragmentComponent, transform: (n: TailwindNode) => TailwindNode): this;
    transformFragment(fragmentName: string, transform: (n: TailwindNode) => TailwindNode): this;
    transformFragment(fragment: FragmentComponent|string, transform: (n: TailwindNode) => TailwindNode): this {
        return this.transform(n => isFragment(typeof fragment === "string" ? fragment : fragment(this.body).fragmentName)(n), transform);
    }
}

export const buildComponent = <T extends TailwindNode = TailwindNode>(body: NucleusBody) => new ComponentBuilder<T>(body);
