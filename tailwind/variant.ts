export default class TailwindVariant {
    constructor(public type: string, protected priority = 1) {

    }

    getPrefix(): string[] {
        return [this.type];
    }

    getPriority() {
        return this.priority;
    }
}

export class TailwindResponsiveVariant extends TailwindVariant {
    constructor(public breakpoint: string) {
        super(breakpoint, -100);
    }
}

export const ResponsiveVariants = {
    sm: () => new TailwindResponsiveVariant("sm"),
    md: () => new TailwindResponsiveVariant("md"),
    lg: () => new TailwindResponsiveVariant("lg"),
    xl: () => new TailwindResponsiveVariant("xl"),
    xxl: () => new TailwindResponsiveVariant("2xl"),
}

export const DarkVariant = () => new TailwindVariant("dark", -10);

export const Variants = {
    ...ResponsiveVariants,
    DarkVariant,
    dark: () => new TailwindVariant("dark", -10),
    hover: () => new TailwindVariant("hover"),
    focus: () => new TailwindVariant("focus"),
    active: () => new TailwindVariant("active"),
    groupHover: () => new TailwindVariant("group-hover"),
    groupFocus: () => new TailwindVariant("group-focus"),
    focusWithin: () => new TailwindVariant("focus-within"),
    focusVisible: () => new TailwindVariant("focus-visible"),
    motionSafe: () => new TailwindVariant("motion-safe", -10),
    motionReduced: () => new TailwindVariant("motion-reduced", -10),
    disabled: () => new TailwindVariant("disabled"),
    visited: () => new TailwindVariant("visited"),
    checked: () => new TailwindVariant("checked"),
    first: () => new TailwindVariant("first"),
    last: () => new TailwindVariant("last"),
    odd: () => new TailwindVariant("odd"),
    even: () => new TailwindVariant("even"),
};
