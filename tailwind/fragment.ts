import {NucleusBody, extractNodeFromBody, NucleusRenderable} from "../node";
import TailwindNode from "./tailwind-node";

export const FRAGMENT_PREFIX = "__FRAGMENT::";

export default class NucleusFragment extends TailwindNode {
    protected handled = false;
    constructor(public fragmentName: string = "") {
        super();
        this.setContext(`${FRAGMENT_PREFIX}${fragmentName}`);
    }

    render(): NucleusRenderable {
        if (this.isEmpty || !this.hasBeenHandled) {
            return [];
        }

        return super.render();
    }

    get hasBeenHandled(): boolean {
        return this.handled;
    }

    get isEmpty() {
        return this.fragmentName === "";
    }

    handle() {
        this.handled = true;
        return this;
    }
}

export function createFragment(name: string, body: NucleusBody) {
    return new NucleusFragment(name).body(body);
}

export function isFragment(name: string): Parameters<typeof extractNodeFromBody>[1] {
    return n => n.getContext() === `${FRAGMENT_PREFIX}${name}`;
}

export type FragmentComponent = (body: NucleusBody) => NucleusFragment;

export const Header = (body: NucleusBody) => createFragment("header", body);
export const Footer = (body: NucleusBody) => createFragment("footer", body);
export const Grow = (body: NucleusBody) => createFragment("grow", body);
