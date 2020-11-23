import {NucleusNode, VNodeProps} from './node';

export interface ModifierHandlerContext {
    parent?: NucleusNode;
    props: VNodeProps;
    classBag: ClassBag;
}

export interface ClassList {
    [key: string]: boolean;
}

export class ClassBag {
    private classes: ClassList = {};

    addClass(className: string, active = true): this {
        this.classes[className] = active;
        return this;
    }

    addClasses(classNames: string[]): this {
        classNames.forEach(name => this.addClass(name));
        return this;
    }

    merge(classes: ClassList|ClassBag): this {
        if (classes instanceof ClassBag) {
            classes = classes.getClasses();
        }
        this.classes = {...this.classes, ...classes};
        return this;
    }

    has(className: string): boolean {
        return className in this.classes;
    }

    isEmpty(): boolean {
        return Object.keys(this.classes).length === 0;
    }

    isNotEmpty(): boolean {
        return !this.isEmpty();
    }

    getClasses(): Readonly<ClassList> {
        return this.classes;
    }
}

export abstract class Modifier {
    protected priority = 1;

    abstract handle(context: ModifierHandlerContext): void;

    getPriority() {
        return this.priority;
    }

    getUniqueIdentifier(): string|null {
        return null;
    }

    needToBeUnique(): boolean {
        return this.getUniqueIdentifier() !== null;
    }


}

export function createModifier(handler: (context: ModifierHandlerContext) => void): Modifier {
    return new class extends Modifier {
        handle(context: ModifierHandlerContext): void {
            handler(context);
        }
    }
}

export function createPropsModifier(handler: (props: VNodeProps) => void): Modifier {
    return createModifier(({props}) => {
        handler(props);
    });
}
