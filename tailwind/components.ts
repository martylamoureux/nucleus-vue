import {NucleusBody} from "../node";
import {ResponsiveVariants} from "./variant";
import {VNode} from "vue";
import TailwindUtility from "./utility";
import {buildComponent} from "./component";
import TailwindNode, {Axis} from "./tailwind-node";
import { Grow, isFragment } from './fragment';

class ContainerNode extends TailwindNode {
    modifiers = [
        new TailwindUtility("container")
    ];

    center() {
        return this.margin(Axis.X, "auto");
    }
}

export function Container(body: NucleusBody) {
    return new ContainerNode().body(body);
}

export class TextNode extends TailwindNode {
    constructor(private text: string, tag: keyof HTMLElementTagNameMap = "span") {
        super(tag);
    }

    getChildrenVNodes(): VNode[] | string {
        return this.text;
    }
}

export class StackNode extends TailwindNode {
    protected switchAt?: keyof typeof ResponsiveVariants;

    constructor(protected axis: Axis, protected reversed = false) {
        super();
    }

    getAxis() {
        return this.axis;
    }

    isReversed() {
        return this.reversed;
    }

    switchAxisAt(breakpoint: keyof typeof ResponsiveVariants) {
        this.switchAt = breakpoint;
        return this;
    }

    protected static applyDirectionalClasses(axis: Axis, reversed: boolean, u: TailwindNode): void {
        u.flexDirection(axis, reversed);
    }

    beforeApplyingModifiers() {
        this.display("flex");
        StackNode.applyDirectionalClasses(this.axis, this.reversed, this);
        if (this.switchAt) {
            this.variant(ResponsiveVariants[this.switchAt](), u => {
                StackNode.applyDirectionalClasses(this.axis === Axis.X ? Axis.Y : Axis.X, this.reversed, u);
                return u;
            });
        }
    }

}

export function Box(body: NucleusBody = []): TailwindNode {
    return new TailwindNode().body(body).setContext("Box");
}

export function Text(text: string): TextNode {
    return new TextNode(text);
}

export function Title(text: string): TextNode {
    return new TextNode(text, "h3").setContext("Title");
}

function buildStack(axis: Axis, body: NucleusBody) {
    return buildComponent<StackNode>(body)
        .transformFragment(Grow, n => Box().grow().body(n.getBody()))
        .render(({ body }) => new StackNode(axis).body(body).setContext("Stack"));
}

export function HStack(body: NucleusBody): StackNode {
    return buildStack(Axis.X, body);
}

export function VStack(body: NucleusBody): StackNode {
    return buildStack(Axis.Y, body);
}
