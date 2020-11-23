import NucleusNode from "../node";
import TailwindUtility from "./utility";
import TailwindVariant, {Variants} from "./variant";

export type VariantUtilities<T extends TailwindNode = TailwindNode> = (u: T) => T;
export type Customizable<T> = T|string;
export type SpacingValues = Customizable<number|"auto"|"px">;
export type DisplayValues = "hidden"|"block"|"inline-block"|"inline"|"flex"|"inline-flex"|"table"|"table-caption"|"table-cell"|"tale-column"|"table-column-group"|"table-footer-group"|"table-header-group"|"table-row-group"|"table-row"|"flow-root"|"grid"|"inline-grid"|"contents";
export type ObjectPositionValues = "bottom"|"center"|"left"|"left-bottom"|"left-top"|"right"|"right-bottom"|"right-top"|"top";
export type TailwindColors = "white"|"black"|string;
export type ExtendedColors = TailwindColors|"transparent"|"current";
export type OverflowValues = "auto"|"hidden"|"visible"|"scroll";
export type OpacityScale = 0|5|10|20|25|30|40|50|60|70|75|80|90|100|number;
export type BorderRadiuses = "none"|"sm"|"md"|"lg"|"xl"|"2xl"|"3xl"|"full"|null|string;
export type BorderWidths = Customizable<0|2|4|8|number|null>;
export type BorderStyles = "solid"|"dashed"|"dotted"|"double"|"none";
export type RingWidths = Customizable<0|1|2|4|8|number|null>;
export type RingOffsetWidths = Customizable<0|1|2|4|8>;
export type FontSizes = Customizable<"xs"|"sm"|"base"|"lg"|"xl"|"2xl"|"3xl"|"4xl"|"5xl"|"6xl"|"7xl"|"8xl"|"9xl">;
export type FontWeight = Customizable<"thin"|"extralight"|"light"|"normal"|"medium"|"semibold"|"bold"|"extrabold"|"black">;
export type FontVariantNumericValues = "normal-nums"|"ordinal"|"slashed-zero"|"lining-nums"|"oldstyle-nums"|"proportional-nums"|"tabular-nums"|"diagonal-fractions"|"stacked-fractions";
export type LetterSpacings = Customizable<"tighter"|"tight"|"normal"|"wide"|"wider"|"widest">;
export type LineHeights = Customizable<"none" | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "tight" | "snug" | "normal" | "relaxed" | "loose">;
export type Widths = Customizable<SpacingValues|"full"|"screen">;

export enum Direction {
    Top = "t",
    TopRight = "tr",
    Right = "r",
    BottomRight = "br",
    Bottom = "b",
    BottomLeft = "bl",
    Left = "l",
    topLeft = "tl"
}

export enum Side {
    Top = "t",
    Bottom = "b",
    Left = "l",
    Right = "r"
}

export enum Axis {
    X = "x",
    Y = "y"
}

export default class TailwindNode extends NucleusNode {

    utility(name: string, value: string|number|null = null) {
        if (typeof value === "number" && value < 0) {
            value = -value;
            name = "-" + name;
        }

        return this.apply(new TailwindUtility(name, value === null ? null : value.toString()));
    }

    variant(variant: TailwindVariant|TailwindVariant[], utilities: VariantUtilities) {
        const node = utilities(new TailwindNode());
        return this.apply(node.modifiers.map(m => {
            if (m instanceof TailwindUtility) {
                (!Array.isArray(variant) ? [variant] : variant).map(v => {
                    m.addVariant(v);
                });
            }
            return m;
        }));
    }

    // Variants
    sm(utilities: VariantUtilities) { return this.variant(Variants.sm(), utilities); }
    md(utilities: VariantUtilities) { return this.variant(Variants.md(), utilities); }
    lg(utilities: VariantUtilities) { return this.variant(Variants.lg(), utilities); }
    xl(utilities: VariantUtilities) { return this.variant(Variants.xl(), utilities); }
    xxl(utilities: VariantUtilities) { return this.variant(Variants.xxl(), utilities); }
    hover(utilities: VariantUtilities) { return this.variant(Variants.hover(), utilities); }
    focus(utilities: VariantUtilities) { return this.variant(Variants.focus(), utilities); }

    // Layout
    boxSizing(value: "border"|"content") { return this.utility("box", value); }
    display(value: DisplayValues) { return this.utility(value); }
    float(value: "none"|"right"|"left") { return this.utility("float", value); }
    clear(value: "left"|"right"|"none"|"both") { return this.utility("clear", value); }
    objectFit(value: "contain"|"cover"|"fill"|"none"|"scale-down") { return this.utility("object", value); }
    objectPosition(value: ObjectPositionValues) { return this.utility("object", value); }
    overflow(value: OverflowValues) { return this.utility("overflow", value); }
    overflowX(value: OverflowValues) { return this.utility("overflow-x", value); }
    overflowY(value: OverflowValues) { return this.utility("overflow-y", value); }
    position(value: "static"|"fixed"|"absolute"|"relative"|"sticky") { return this.utility(value); }
    // Layout shorthands
    block() { return this.display("block"); }
    inline() { return this.display("inline"); }
    hidden() { return this.display("hidden"); }
    grid() { return this.display("grid"); }
    absolute() { return this.position("absolute"); }
    relative() { return this.position("relative"); }

    // Flexbox
    flexDirection(axis: Axis, reverse = false) { return this.utility("flex", `${axis === Axis.X ? "row" : "col"}${reverse ? "-reverse" : ""}`); }
    flexWrap(value: "wrap" | "wrap-reverse" | "nowrap") { return this.utility("flex", value); }
    flex(value: 1 | "1" | "auto" | "initial" | "none") { return this.utility("flex", value); }
    grow(enabled = true) { return this.utility("flex", enabled ? "grow" : "grow-0"); }
    shrink(enabled = true) { return this.utility("flex", enabled ? "shrink" : "shrink-0"); }
    order(value: Customizable<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "first" | "last" | "none">) { return this.utility("order", value); }
    // Shorthands
    noGrow() { return this.grow(false); }
    noShrink() { return this.shrink(false); }

    // Grid

    // Box Alignment

    // Spacing
    margin(margin: SpacingValues): this;
    margin(axis: Axis, margin: SpacingValues): this;
    margin(side: Side, margin: SpacingValues): this;
    margin(a: SpacingValues|Axis|Side, margin?: SpacingValues): this {
        if (margin === undefined) {
            return this.utility("m", a);
        }
        return this.utility(`m${a}`, margin);
    }
    padding(padding: SpacingValues): this;
    padding(axis: Axis, padding: SpacingValues): this;
    padding(side: Side, padding: SpacingValues): this;
    padding(a: SpacingValues|Axis|Side, padding?: SpacingValues): this {
        if (padding === undefined) {
            return this.utility("p", a);
        }
        return this.utility(`p${a}`, padding);
    }

    // Sizing
    width(value: Widths) { return this.utility("w", value); }
    height(value: Widths) { return this.utility("h", value); }

    // Typography
    fontFamily(value: Customizable<"sans"|"serif"|"mono">) { return this.utility("font", value); }
    fontSize(value: FontSizes) { return this.utility("text", value); }
    antialiased(subpixel = false) { return this.utility(subpixel ? "antialiased" : "subpixel-antialiased"); }
    italic(enabled = true) { return this.utility(enabled ? "italic" : "not-italic"); }
    fontWeight(value: FontWeight) { return this.utility("font", value); }
    fontVariantNumeric(value: FontVariantNumericValues) { return this.utility(value); }
    letterSpacing(value: LetterSpacings) { return this.utility("tracking", value); }
    lineHeight(value: LineHeights) { return this.utility("leading", value); }
    listStyleType(value: "none"|"disc"|"decimal") { return this.utility("list", value); }
    listStylePosition(value: "inside"|"outside") { return this.utility("list", value); }
    placeholderColor(color: ExtendedColors) { return this.utility("placeholder", color); }
    placeholderOpacity(value: OpacityScale) { return this.utility("placeholder-opacity", value); }
    textAlign(value: "left"|"center"|"right"|"jutify") { return this.utility("text", value); }
    textColor(color: ExtendedColors) { return this.utility("text", color); }
    textOpacity(value: OpacityScale) { return this.utility("text-opacity", value); }
    underline() { return this.utility("underline"); }
    lineThrough() { return this.utility("line-through"); }
    noUnderline() { return this.utility("no-underline"); }
    uppercase() { return this.utility("uppercase"); }
    lowercase() { return this.utility("lowercase"); }
    capitalize() { return this.utility("capitalize"); }
    normalCase() { return this.utility("normal-case"); }
    truncate() { return this.utility("truncate"); }
    textOverflow(value: "ellipsis"|"clip") { return this.utility("overflow", value); }
    whiteSpace(value: "normal"|"nowrap"|"pre"|"pre-line"|"pre-wrap") { return this.utility("whitespace", value); }
    wordBreak(value: "normal"|"words"|"all") { return this.utility("break", value); }
    // Shorthands
    textSize(value: FontSizes) { return this.fontSize(value); }
    color(color: ExtendedColors) { return this.textColor(color); }
    noItalic() { return this.italic(false); }
    tracking(value: LetterSpacings) { return this.letterSpacing(value); }
    leading(value: LineHeights) { return this.lineHeight(value); }
    bold() { return this.fontWeight("bold"); }
    light() { return this.fontWeight("light"); }
    medium() { return this.fontWeight("medium"); }
    semibold() { return this.fontWeight("semibold"); }
    extraBold() { return this.fontWeight("extrabold"); }

    // Backgrounds
    bgAttachment(value: "fixed"|"local"|"scroll") { return this.utility("bg", value); }
    bgClip(value: "border"|"padding"|"content"|"text") { return this.utility("bg-clip", value); }
    bgColor(value: TailwindColors) { return this.utility("bg", value); }
    bgOpacity(value: OpacityScale) { return this.utility("bg-opacity", value); }
    bgPosition(value: ObjectPositionValues) { return this.utility("bg", value); }
    bgRepeat(value: "repeat"|"no-repeat"|"repeat-x"|"repeat-y"|"repeat-round"|"repeat-space") { return this.utility("bg", value); }
    bgSize(value: "auto"|"cover"|"contain") { return this.utility("bg", value); }
    bgNone() { return this.utility("bg", "none"); }
    bgGradient(direction: Direction, from: TailwindColors, to: TailwindColors): this;
    bgGradient(direction: Direction, from: TailwindColors, via: TailwindColors, to: TailwindColors): this;
    bgGradient(direction: Direction, color1: TailwindColors, color2: TailwindColors, color3?: TailwindColors): this {
        const res = this.utility(`bg-gradient-to-${direction}`).utility("from", color1);
        if (color3 === undefined) {
            return res.utility("to", color2);
        }
        return res.utility("via", color2).utility("to", color3);
    }
    // Shorthands
    bgCover() { return this.bgSize("cover"); }

    // Borders
    rounded(value: BorderRadiuses, direction: Direction|null = null) {
        return this.utility(direction === null ? "rounded" : `rounded-${direction}`, value);
    }
    border(side: Side|null = null, width: BorderWidths = null) {
        return this.utility(side === null ? "border" : `border-${side}`, width);
    }
    borderColor(color: ExtendedColors) { return this.utility("border", color); }
    borderOpacity(value: OpacityScale) { return this.utility("border-opacity", value); }
    borderStyle(value: BorderStyles) { return this.utility("border", value); }
    divide(axis: Axis, width: BorderWidths = null, reverse = false) {
        return this.utility(`divide-${axis}`, width).when(reverse, node => node.utility(`divide-${axis}`, "reverse"));
    }
    divideColor(color: ExtendedColors) { return this.utility("divide", color); }
    divideOpacity(value: OpacityScale) { return this.utility("divide-opacity", value); }
    divideStyle(value: BorderStyles) { return this.utility("divide", value); }
    ring(value: RingWidths) { return this.utility("ring", value); }
    insetRing() { return this.utility("ring", "inset"); }
    ringColor(color: ExtendedColors) { return this.utility("ring", color); }
    ringOpacity(value: OpacityScale) { return this.utility("ring-opacity", value); }
    ringOffset(value: RingOffsetWidths) { return this.utility("ring-offset", value); }
    ringOffsetColor(color: ExtendedColors) { return this.utility("ring-offset", color); }
    // Shorthands
    pill() { return this.rounded("full"); }
    noRounding() { return this.rounded("none"); }

    // Effects
    shadow(value: null|string|"sm"|"md"|"lg"|"xl"|"2xl"|"inner"|"none" = null) { return this.utility("shadow", value); }
    opacity(value: OpacityScale) { return this.utility("opacity", value); }
    // Shorthands
    opaque() { return this.opacity(100); }
    transparent() { return this.opacity(0); }
    noShadow() { return this.shadow("none"); }

    // Tables

    // Transitions and Animations

    // Transforms

    // Interactivity

    // Svg

    // Accessibility

}

