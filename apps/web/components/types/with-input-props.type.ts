export type TWithInputProps<V> = {
    value: V | undefined;
    onChange: (event: { target: { value: V | undefined; }; }) => void;
};