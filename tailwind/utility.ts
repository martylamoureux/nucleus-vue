import TailwindVariant from "./variant";
import {Modifier, ModifierHandlerContext} from "../modifier";

export default class TailwindUtility extends Modifier {
    protected variants: TailwindVariant[] = [];

    constructor(private utilityName: string, private utilityValue: string|null = null) {
        super();
    }

    addVariant(variant: TailwindVariant): this {
        this.variants.push(variant);
        return this;
    }

    getVariants(): TailwindVariant[] {
        return this.variants.sort((a, b) => a.getPriority() < b.getPriority() ? -1 : 1);
    }

    getPrefix(): string {
        return this.getVariants().map(v => `${v.getPrefix()}:`).join();
    }

    getClasses(): string[] {
        if (this.utilityValue !== null) {
            return [`${this.utilityName}-${this.utilityValue}`];
        }

        return [this.utilityName];
    }

    handle(context: ModifierHandlerContext): void {
        context.classBag.addClasses(this.getClasses().map(s => this.getPrefix() + s));
    }
}
