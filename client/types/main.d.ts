/* eslint-disable @typescript-eslint/interface-name-prefix */

declare module 'meteor/reactive-dict' {
	// @ts-ignore
	const ReactiveDict: ReactiveDictStatic;
	interface ReactiveDictStatic {
		new <T>(name: string, initialValue?: T): ReactiveDict<T>;
	}
	// @ts-ignore
	interface ReactiveDict<T> {
		get(name: string): T;
		set(name: string, newValue: T): void;
	}
}
