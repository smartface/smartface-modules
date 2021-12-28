export declare type GetProps<TBase> = TBase extends new (props: infer P) => any ? P : never;
export declare type GetInstance<TBase> = TBase extends new (...args: any[]) => infer I ? I : never;
export declare type MergeCtor<A, B> = new (props: GetProps<A> & GetProps<B>) => GetInstance<A> & GetInstance<B>;
