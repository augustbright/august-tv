import { MyContent } from "./my-videos";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <MyContent />
            {children}
        </>
    );
}
