import {VNode} from "vue";
import {nucleusBodyToNodes, NucleusNodes} from "./node";

//export const flattened = <T>(arr: T[]|T[][]) => ([] as T[]).concat(...arr);

export function renderNucleusBody(body: NucleusNodes): VNode[] {
    return nucleusBodyToNodes(body).map(node => node.toVNodes()).flat();
}

export function nucleus(body: NucleusNodes): () => VNode[] {
    return () => renderNucleusBody(body);
}

export * from "./node";
export * from "./modifier";
export * from "./tailwind/fragment";
export * from "./tailwind/component";
export * from "./tailwind/components";
export * from "./tailwind/tailwind-node";
export * from "./tailwind/utility";
export * from "./tailwind/variant";


